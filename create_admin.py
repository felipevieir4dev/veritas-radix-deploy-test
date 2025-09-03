#!/usr/bin/env python
"""
Script para criar superusuário do Django no Render
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veritas_radix.settings')
sys.path.append('/opt/render/project/src/src/backend')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Criar superusuário se não existir
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@veritasradix.com',
        password='admin123'
    )
    print("Superusuário criado: admin / admin123")
else:
    print("Superusuário já existe")