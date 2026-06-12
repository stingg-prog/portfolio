from django.db import models


class PortfolioProfile(models.Model):
    name = models.CharField(max_length=200, default='Syamraj R')
    profile_image = models.ImageField(
        upload_to='profile/',
        blank=True,
        null=True,
        help_text="Upload the profile picture used in the hero, avatar, and social preview image."
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Portfolio Profile'
        verbose_name_plural = 'Portfolio Profile'

    def __str__(self):
        return self.name


class ResumeUpload(models.Model):
    title = models.CharField(max_length=200, default='Syamraj R Resume')
    description = models.TextField(
        default="Download Syamraj R's complete curriculum resume detailing CEH certifications, Advanced Diploma specifications, and full Django capabilities."
    )
    resume_file = models.FileField(
        upload_to='resumes/',
        help_text='Upload the current resume file recruiters should download.'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Only the active resume is shown on the portfolio download section.'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_active', '-updated_at']
        verbose_name = 'Resume Upload'
        verbose_name_plural = 'Resume Uploads'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_active:
            ResumeUpload.objects.exclude(pk=self.pk).update(is_active=False)

class Project(models.Model):
    title = models.CharField(max_length=200, help_text="Title of the project (e.g., SYAFRA)")
    description = models.TextField(help_text="Detailed description of the project engineering features")
    github_url = models.URLField(max_length=500, blank=True, null=True, help_text="GitHub repository URL")
    live_url = models.URLField(max_length=500, blank=True, null=True, help_text="Live website URL")
    image = models.CharField(max_length=300, default='assets/syafra.png', help_text="Static relative image path inside core/static/ (e.g., assets/syafra.png)")
    tags = models.CharField(max_length=300, help_text="Comma-separated technologies (e.g., Python, Django, PostgreSQL)")
    order = models.IntegerField(default=0, help_text="Integer indicating rendering order (lower numbers display first)")

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title

    def get_tags_list(self):
        """Returns the tags as a clean list for Django templates"""
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]

    @property
    def image_static_path(self):
        """Return a normalized static-relative path for template use."""
        if self.image.startswith('static/'):
            return self.image.split('static/', 1)[1]
        return self.image


class Certification(models.Model):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    badge_icon = models.CharField(max_length=10, default='🛡️', help_text="Unicode icon emoji (e.g. 🐍, 🛡️, 🔒)")
    description = models.TextField(blank=True, null=True)
    certificate_image = models.ImageField(
        upload_to='certificates/',
        blank=True,
        null=True,
        help_text="Upload the certificate image that should appear when this headline is selected."
    )
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class TimelineItem(models.Model):
    period = models.CharField(max_length=100, help_text="Time period label (e.g., Early 2024)")
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.period} - {self.title}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
