from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Seed database with default user accounts'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # List of fixed single users
        single_users = [
            {'username': 'admin', 'email': 'admin@desa.id', 'password': 'admin123', 'role': 'ADMIN', 'is_superuser': True, 'is_staff': True},
            {'username': 'sekdes', 'email': 'sekdes@desa.id', 'password': 'sekdes123', 'role': 'SEKDES'},
            {'username': 'kaur_perencanaan', 'email': 'kaur_perencanaan@desa.id', 'password': 'kaur123', 'role': 'KAUR_PERENCANAAN'},
            {'username': 'kaur_tu', 'email': 'kaur_tu@desa.id', 'password': 'kaur123', 'role': 'KAUR_TU'},
            {'username': 'kaur_keuangan', 'email': 'kaur_keuangan@desa.id', 'password': 'kaur123', 'role': 'KAUR_KEUANGAN'},
            {'username': 'kasi_pemerintahan', 'email': 'kasi_pemerintahan@desa.id', 'password': 'kasi123', 'role': 'KASI_PEMERINTAHAN'},
            {'username': 'kasi_kesejahteraan', 'email': 'kasi_kesejahteraan@desa.id', 'password': 'kasi123', 'role': 'KASI_KESEJAHTERAAN'},
            {'username': 'kasi_pelayanan', 'email': 'kasi_pelayanan@desa.id', 'password': 'kasi123', 'role': 'KASI_PELAYANAN'},
        ]

        # Generate single users
        for u in single_users:
            self.create_user(**u)

        # Generate Kadus I-IV
        romans = ['I', 'II', 'III', 'IV']
        for i, roman in enumerate(romans, start=1):
            self.create_user(
                username=f'kadus{i}',
                password='kadus123',
                role='KADUS',
                unit_detail=f'Kadus {roman}'
            )

        # Generate Posyandu Mawar 1-7
        for i in range(1, 8):
            self.create_user(
                username=f'posyandu_mawar{i}',
                password='posyandu123',
                role='POSYANDU',
                unit_detail=f'Mawar {i}'
            )

        # Generate LPM 001-009
        for i in range(1, 10):
            num_str = f"{i:03d}"
            self.create_user(
                username=f'lpm_{num_str}',
                password='lpm123',
                role='LPM',
                unit_detail=num_str
            )

        # Generate RW 001-009
        for i in range(1, 10):
            num_str = f"{i:03d}"
            self.create_user(
                username=f'rw_{num_str}',
                password='rw123',
                role='RW',
                unit_detail=num_str
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded all users!'))

    def create_user(self, username, password, role, email='', unit_detail='', is_superuser=False, is_staff=False):
        if not CustomUser.objects.filter(username=username).exists():
            if is_superuser:
                user = CustomUser.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password,
                )
            else:
                user = CustomUser.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )
            
            user.role = role
            if unit_detail:
                user.unit_detail = unit_detail
            if is_staff:
                user.is_staff = True
                
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {username} (Role: {role})'))
        else:
            self.stdout.write(self.style.WARNING(f'User {username} already exists.'))
