FROM python:3.9
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN chmod +x get-docker.sh
RUN sh get-docker.sh
COPY . .
EXPOSE 8080


CMD ["python","manage.py","runserver","0.0.0.0:8080"]
