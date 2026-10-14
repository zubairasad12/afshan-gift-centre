import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Record message into AuditLog for admin tracking
    await prisma.auditLog.create({
      data: {
        action: 'CONTACT_FORM_SUBMISSION',
        entity: 'Contact',
        details: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          subject: subject?.trim() || 'General Inquiry',
          message: message.trim(),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. Our team in Vehari will contact you shortly!',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again or reach out on WhatsApp at 03001005861.' },
      { status: 500 }
    );
  }
}
