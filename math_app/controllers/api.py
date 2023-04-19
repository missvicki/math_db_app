import flask
from flask import Flask, jsonify
from flask import  Blueprint
from ..models import StudentLim
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/test')
def apitest():
  # OLD VERSION
  # Processes data from database to create bar graph number of students that graduate each year.

  # students = StudentLim.query.all()
  # testData = {}
  # data = []
  # for student in students:
  #   if student.grad in testData:
  #     testData[student.grad] += 1
  #   else:
  #     if student.grad == None or student.grad == 0:
  #       continue
  #     else:
  #       testData[student.grad] = 0
  # for key, value in testData.items():
  #   finalData.append({"year": key, "students": value})
  
  
  # NEW VERSION
  # Does the same in less lines!! 
  # Difference is we are writing more precise queries to the database, 
  # instead of getting all the data from the database and filtering through it here
  data = []
  # Getting all the different grad years
  years = StudentLim.query.with_entities(StudentLim.grad).distinct()
  for student in years:
    # Getting the amount of students that graduated in each grad year
    amount = StudentLim.query.filter(StudentLim.grad == student.grad).count()
    # Creating a dictionary and appending it to the data array
    data.append({"year": student.grad, "students": amount})
  # Converting data array of dictionaries into JSON
  return json.dumps(data)

@api_bp.route('/stacked')
def stackedbar():
  # test = StudentLim.query.filter(StudentLim.plan.contains("Engineering"))
  # print("PEANUT BUTTER")
  # print(test)
  # # print(test.all())
  # # return test.all()
  # return [s.plan for s in test.all()]
  q = sqlalchemy.select([StudentLim.c.plan, sqlalchemy.func.count(StudentLim.c.plan)]).group_by(StudentLim.c.plan)
  return q
