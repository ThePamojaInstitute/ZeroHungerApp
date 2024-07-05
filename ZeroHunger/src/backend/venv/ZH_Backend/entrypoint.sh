echo "Python migrating..."
python manage.py makemigrations;
python manage.py migrate --no-input;
python manage.py collectstatic --no-input;

gunicorn ZH_Backend.wsgi:application --bind 0.0.0.0:8080