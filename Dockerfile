FROM image-mirror-prod-registry.cloud.duke.edu/library/python:3.10

RUN mkdir /srv/app
WORKDIR /srv/app

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN apt update -y

RUN apt install htop -y

RUN apt install default-mysql-client -y


COPY . .

EXPOSE 5000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
