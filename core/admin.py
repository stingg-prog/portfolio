from django.contrib import admin
from .models import PortfolioProfile, ResumeUpload, Project, Certification, TimelineItem, ContactMessage

@admin.register(PortfolioProfile)
class PortfolioProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'has_profile_image', 'updated_at')
    readonly_fields = ('updated_at',)
    fields = ('name', 'profile_image', 'updated_at')

    def has_profile_image(self, obj):
        return bool(obj.profile_image)
    has_profile_image.boolean = True
    has_profile_image.short_description = 'Profile image'

    def has_add_permission(self, request):
        if PortfolioProfile.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(ResumeUpload)
class ResumeUploadAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'has_resume_file', 'uploaded_at', 'updated_at')
    list_editable = ('is_active',)
    readonly_fields = ('uploaded_at', 'updated_at')
    search_fields = ('title', 'description')
    fields = ('title', 'description', 'resume_file', 'is_active', 'uploaded_at', 'updated_at')

    def has_resume_file(self, obj):
        return bool(obj.resume_file)
    has_resume_file.boolean = True
    has_resume_file.short_description = 'Resume file'

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'github_url', 'live_url')
    list_editable = ('order',)
    search_fields = ('title', 'tags')
    list_filter = ('tags',)

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'has_certificate_image', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'issuer')
    fields = ('title', 'issuer', 'badge_icon', 'description', 'certificate_image', 'order')

    def has_certificate_image(self, obj):
        return bool(obj.certificate_image)
    has_certificate_image.boolean = True
    has_certificate_image.short_description = 'Certificate image'

@admin.register(TimelineItem)
class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ('period', 'title', 'order')
    list_editable = ('order',)
    search_fields = ('period', 'title')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    list_filter = ('created_at',)
    
    def has_add_permission(self, request):
        # Recruiter messages are submitted via frontend form only
        return False
