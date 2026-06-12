#!/usr/bin/env python
"""
Pre-seeding utility script for Syamraj R's Django Portfolio.
Executes migrations, registers superuser, and seeds databases with actual content.
"""
import os
import sys
import django

def seed():
    # Configure Django Settings environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_project.settings')
    django.setup()

    from django.core.management import call_command
    from django.contrib.auth.models import User
    from core.models import Project, Certification, TimelineItem

    print("Step 1: Running Django Database Migrations...")
    call_command('makemigrations', 'core', interactive=False)
    call_command('migrate', interactive=False)
    print("Database Migrations completed successfully.")

    print("\nStep 2: Creating Admin Superuser Accounts...")
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='syamrajalpy334@gmail.com',
            password='syamraj123'
        )
        print("Superuser created successfully!")
        print("  - Username: admin")
        print("  - Password: syamraj123")
    else:
        print("Superuser 'admin' already exists.")

    print("\nStep 3: Seeding Portfolio Projects...")
    Project.objects.all().delete()
    syafra_project = Project.objects.create(
        title="SYAFRA – Live Ecommerce Platform",
        description="Designed, developed, deployed, and currently operating a live ecommerce platform for an online vintage jacket store.",
        github_url="https://github.com/stingg-prog",
        live_url="https://syafra.com",
        image="assets/syafra.png",
        tags="Python, Django, PostgreSQL, HTML5, CSS3, JavaScript, Razorpay, SMTP",
        order=1
    )
    print(f"Created Project: {syafra_project.title}")

    print("\nStep 4: Seeding Certification Credentials...")
    Certification.objects.all().delete()
    certs = [
        {
            "title": "Certified Ethical Hacker (CEH)",
            "issuer": "EC-Council Verification",
            "badge_icon": "🛡️",
            "description": "Security Hardened Software baseline",
            "order": 1
        },
        {
            "title": "Advanced Diploma in Cyber Defence",
            "issuer": "Cyber Security Operations Specialized",
            "badge_icon": "🔒",
            "description": "Network & System hardening expert",
            "order": 2
        },
        {
            "title": "Python Full Stack Web Development",
            "issuer": "Inmakes Learning Hub, Kadavanthra",
            "badge_icon": "🐍",
            "description": "Django architecture & Postgres control",
            "order": 3
        }
    ]
    for c in certs:
        obj = Certification.objects.create(**c)
        print(f"Created Certification: {obj.title}")

    print("\nStep 5: Seeding Timeline Milestones...")
    TimelineItem.objects.all().delete()
    milestones = [
        {
            "period": "Early 2024",
            "title": "Cyber Defence Specialized",
            "description": "Completed Advanced Diploma in Cyber Defence. Focused on network vulnerabilities, systems analysis, and secure configurations.",
            "order": 1
        },
        {
            "period": "Mid 2024",
            "title": "Certified Ethical Hacker (CEH)",
            "description": "Secured CEH credential from EC-Council. Focused on penetration testing, web application hacking, and API endpoint auditing.",
            "order": 2
        },
        {
            "period": "Late 2024",
            "title": "Fullstack Python Specialization",
            "description": "Completed intensive training at Inmakes Learning Hub, Kadavanthra, mastering Django pipelines, PostgreSQL schema design, and JavaScript core logic.",
            "order": 3
        },
        {
            "period": "Late 2024",
            "title": "SYAFRA Architecture & Launch",
            "description": "Designed, developed, and deployed the live SYAFRA online platform. Handled database design, inventory automation rules, and payment gateways.",
            "order": 4
        },
        {
            "period": "Present",
            "title": "Live Commercial Operations",
            "description": "Directly operating SYAFRA Ecommerce platform. Overseeing server uptime, order database logging, and automated confirmations.",
            "order": 5
        }
    ]
    for m in milestones:
        obj = TimelineItem.objects.create(**m)
        print(f"Created Timeline Milestone: {obj.period} - {obj.title}")

    print("\nPre-seeding process finished! The database is now ready.")

if __name__ == '__main__':
    seed()
