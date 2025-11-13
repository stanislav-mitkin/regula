import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auditProgressMap } from '../audit-state';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get('id');
    
    if (!auditId) {
      return NextResponse.json(
        { success: false, error: 'Audit ID is required' },
        { status: 400 }
      );
    }
    
    // Always read DB for authoritative status and risk_level
    const { data: audit, error: auditError } = await supabase
      .from('audit_requests')
      .select('*')
      .eq('id', auditId)
      .single();
    if (auditError || !audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }
    const status = audit.status;
    const risk_level = audit.risk_level || 'unknown';
    let violations = [];
    
    // Get violations if audit is completed
    if (status === 'completed') {
      const { data: violationsData, error: violationsError } = await supabase
        .from('violations')
        .select('*')
        .eq('audit_id', auditId);
      
      if (!violationsError && Array.isArray(violationsData)) {
        violations = violationsData;
      }
    }
    
    const progressEntry = auditProgressMap.get(auditId);
    const checks = progressEntry?.checks || [];
    const progress = progressEntry?.progress ?? (status === 'completed' ? 100 : 0);

    // Generate summary
    let summary = '';
    if (status === 'pending') {
      summary = 'Проверка в процессе выполнения';
    } else if (status === 'completed') {
      if (violations.length === 0) {
        summary = 'Критических нарушений не обнаружено';
      } else {
        const criticalCount = violations.filter(v => v.severity === 'critical').length;
        const highCount = violations.filter(v => v.severity === 'high').length;
        
        if (criticalCount > 0) {
          summary = `Обнаружено ${criticalCount} критических и ${highCount} высокорисковых нарушений`;
        } else if (highCount > 0) {
          summary = `Обнаружено ${highCount} высокорисковых нарушений`;
        } else {
          summary = `Обнаружено ${violations.length} нарушений средней и низкой степени риска`;
        }
      }
    } else {
      summary = 'Проверка завершилась с ошибкой';
    }
    
    return NextResponse.json({
      success: true,
      status: status,
      violations: violations,
      riskLevel: risk_level,
      summary: summary,
      progress: progress,
      checks: checks
    });
    
  } catch (error) {
    console.error('Error getting report status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
