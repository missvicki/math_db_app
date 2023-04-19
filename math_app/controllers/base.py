import flask
from flask import Flask, render_template, jsonify
from flask import  Blueprint
from ..models import Course, StudentLim
import json
from flask import request
import urllib.parse
import os
base_bp = Blueprint('base', __name__, url_prefix='/base')

@base_bp.route('', methods=["GET"])
def index():
  # test = StudentLim.query.select()
  # q = select(StudentLim).where(StudentLim.grad == "2022")
  # test = session.execute(q).all()
  # q2 = session.query(StudentLim.grad).distinct()
  # years = session.execute(q2).all()
  url_key = os.environ.get("URL")
  
  test = StudentLim.query.with_entities(StudentLim.grad, StudentLim.studxid)
  courses = Course.query.all()
  return render_template('index.html', courses = courses[:11], test = test[:11], url_key = url_key)


@base_bp.route("/json")
def my_test_json():
  test = Course.query.all()
  course_data = [course.semester for course in list(test)]
  ret_data = []
  semesters = Course.query.with_entities(Course.semester).distinct()
  for sem in semesters:
    amount = Course.query.filter(Course.semester == sem.semester).count()
    ret_data.append({"semester": sem.semester, "students": amount})
  return ret_data

# Ignore this, this route is useless
@base_bp.route("/stacked")
def my_test_stacked():
  # test = StudentLim.query.all()
  # student_plans = [student.plan for student in list(test)]
  ret_data = []
  seen_plans = set()
  plans = StudentLim.query.with_entities(StudentLim.plan).distinct()
  years = StudentLim.query.with_entities(StudentLim.grad).distinct()
  for plan in plans:
    if (str(plan.plan) not in seen_plans): # and str(plan.plan).split('-')[0] == 'Undergraduate Engineering ' or str(plan.plan).split('-')[0] == 'Undergraduate Engineering':
      amount = StudentLim.query.filter(StudentLim.plan == plan.plan).count()
      ret_data.append({"plan": str(plan.plan), "amount": amount})
      seen_plans.add(str(plan.plan).split('-')[0])
    elif (str(plan.plan) not in seen_plans): # and str(plan.plan).split('-')[0] == 'Trinity College ' or str(plan.plan).split('-')[0] == 'Trinity College' or str(plan.plan) == 'Sophomore' or str(plan.plan) == 'Junior':
      amount = StudentLim.query.filter(StudentLim.plan == plan.plan).count()
      ret_data.append({"plan": str(plan.plan), "amount": amount})
      seen_plans.add(str(plan.plan).split('-')[0])
  # amount = StudentLim.query.filter(StudentLim.plan == plan.plan).count()
    # ret_data.append({'year': year.grad, "plan": plan.plan, "amount": amount})
  return ret_data

@base_bp.route("/group_by_year")
def group_by_year():
  return json.dumps(StudentLim.group_by_year())

@base_bp.route("/group_by_year_and_college")
def group_by_year_and_college():
  return json.dumps(StudentLim.group_by_year_and_college(request.args.get('search')))

@base_bp.route("/count_students_in_input_by_year")
def count_students_in_input_by_year():
  return json.dumps(StudentLim.sum_of_students(request.args.get('search')))


# ONLY TWO ROUTES CURRENTLY IN USE

@base_bp.route("/multi_parameter_search")
def multi_parameter_search():
  return json.dumps(StudentLim.multi_parameter_search_bar(urllib.parse.unquote(request.args.get('search'))))
  # return json.dumps(StudentLim.multi_param_search_line(urllib.parse.unquote(request.args.get('search'))))

@base_bp.route("/mp_search_grad")
def mp_search_grad():
  return json.dumps(StudentLim.multi_parameter_search_bar(urllib.parse.unquote(request.args.get('search'))))
  # return json.dumps(StudentLim.multi_param_search_line(urllib.parse.unquote(request.args.get('search'))))
  # return json.dumps(Course.get_classes())
  # return json.dumps(Course.search_by_course(urllib.parse.unquote(request.args.get('search'))))

@base_bp.route("/mp_search_grad_table")
def mp_search_grad_table():
  return json.dumps(StudentLim.multi_parameter_search_bar_table(urllib.parse.unquote(request.args.get('search')), urllib.parse.unquote(request.args.get('time'))))

@base_bp.route("/mp_search_classes")
def mp_search_classes():
  # return json.dumps(StudentLim.multi_parameter_search(urllib.parse.unquote(request.args.get('search'))))
  # return json.dumps(Course.get_classes())
  return json.dumps(Course.search_by_course(urllib.parse.unquote(request.args.get('search'))))

# @base_bp.route("/multi_parameter_search")
# def multi_parameter_search():
#   return json.dumps(StudentLim.multi_parameter_search(urllib.parse.unquote(request.args.get('search'))))
#   # return json.dumps(Course.get_classes())
#   # return json.dumps(Course.search_by_course(urllib.parse.unquote(request.args.get('search'))))
   
@base_bp.route("/generate_table")
def generate_table():
  return json.dumps(StudentLim.show_count_per_year(request.args.get('search'), request.args.get('year')))

# Navigation Bar routes
@base_bp.route("/graphs")
def generate_graphs():
  return json.dumps(Course.get_distinct_classes())

@base_bp.route("/about")
def generate_about():
  return 'this is another page?'