from django.shortcuts import render
from django.http import JsonResponse
from django.templatetags.static import static
from django.core.mail import send_mail
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import PortfolioProfile, ResumeUpload, Project, Certification, TimelineItem, ContactMessage

def portfolio_view(request):
    """Renders the main single-page recruiter portfolio website"""
    projects = Project.objects.all()
    certifications = Certification.objects.all()
    timeline_items = TimelineItem.objects.all()
    portfolio_profile = PortfolioProfile.objects.first()
    resume_upload = ResumeUpload.objects.filter(is_active=True, resume_file__isnull=False).first()
    profile_image_url = static('assets/profile.png')

    if portfolio_profile and portfolio_profile.profile_image:
        profile_image_url = portfolio_profile.profile_image.url
    
    context = {
        'projects': projects,
        'certifications': certifications,
        'timeline_items': timeline_items,
        'portfolio_profile': portfolio_profile,
        'profile_image_url': profile_image_url,
        'resume_upload': resume_upload,
    }
    return render(request, 'index.html', context)

@require_POST
def contact_form_view(request):
    """Processes contact queries asynchronously via secure AJAX"""
    name = request.POST.get('name', '').strip()
    email = request.POST.get('email', '').strip()
    subject = request.POST.get('subject', '').strip()
    message = request.POST.get('message', '').strip()
    
    # Server-side validation
    if not all([name, email, subject, message]):
        return JsonResponse({
            'status': 'error',
            'message': 'All form fields are strictly required.'
        }, status=400)
        
    if '@' not in email:
        return JsonResponse({
            'status': 'error',
            'message': 'Please supply a structurally valid email address.'
        }, status=400)
        
    try:
        # Commit direct recruiter record to SQLite database
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        # Send email notification to Syamraj
        email_subject = f'Portfolio Contact: {subject}'
        email_message = (
            f'Name: {name}\n'
            f'Email: {email}\n\n'
            f'Message:\n{message}'
        )
        send_mail(
            email_subject,
            email_message,
            email,
            ['syamrajalpy334@gmail.com'],
            fail_silently=False,
        )

        return JsonResponse({
            'status': 'success',
            'message': 'Message sent successfully.'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': 'Failed to send message. Please try again.'
        }, status=500)
