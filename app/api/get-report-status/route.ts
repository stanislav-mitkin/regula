import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    
    // Get audit request
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
    
    // Get violations if audit is completed
    let violations = [];
    if (audit.status === 'completed') {
      const { data: violationsData, error: violationsError } = await supabase
        .from('violations')
        .select('*')
        .eq('audit_id', auditId);
      
      if (!violationsError) {
        violations = violationsData || [];
      }
    }
    
    // Generate summary
    let summary = '';
    if (audit.status === 'pending') {
      summary = 'Проверка в процессе выполнения';
    } else if (audit.status === 'completed') {
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
      status: audit.status,
      violations: violations,
      riskLevel: audit.risk_level || 'unknown',
      summary: summary
    });
    
  } catch (error) {
    console.error('Error getting report status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}