import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const submitLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  service: z.string().max(100, 'Service name too long').optional(),
  captchaToken: z.string().max(1000, 'Token too long').optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = submitLeadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          validationErrors: validationResult.error.message 
        },
        { status: 400 }
      );
    }
    
    const { name, email, service, captchaToken } = validationResult.data;
    const leadId = uuidv4();
    
    // Check if lead with this email already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingLead) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Lead with this email already exists' 
        },
        { status: 409 }
      );
    }
    
    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        id: leadId,
        email,
        name,
        phone: null,
        company: null,
        status: 'new',
        source: 'landing'
      })
      .select()
      .single();
    
    if (leadError) {
      console.error('Database error creating lead:', leadError);
      return NextResponse.json(
        { success: false, error: 'Failed to create lead' },
        { status: 500 }
      );
    }
    
    // Create service request
    const serviceRequestId = uuidv4();
    const effectiveService = service && service.trim() ? service : 'paid_report';
    const price = effectiveService === 'paid_report' ? 1990.0 : null;
    const { error: serviceError } = await supabase
      .from('service_requests')
      .insert({
        id: serviceRequestId,
        lead_id: leadId,
        service_type: effectiveService,
        status: 'pending',
        price
      });
    
    if (serviceError) {
      console.error('Database error creating service request:', serviceError);
      // Don't fail the entire request if service request fails
    }
    
    // TODO: Send notification email to admin
    // TODO: Send confirmation email to lead
    
    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully'
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
