from sqlalchemy import Column, Integer, String
from .database import Base, db_session
# Pro Tip: The import in flask shell to test works like this
# from math_app.models import Course

class Course(Base):
  __tablename__ = 'classes'
  id = Column(Integer, primary_key=True)
  name = Column(String)
  section = Column(String)
  storm_num = Column(Integer)
  semester = Column(Integer)
  year = Column(Integer)
  instruct = Column(String)
  room = Column(String)
  size = Column(Integer)
  max = Column(Integer)
  wait = Column(Integer)
  mxsz = Column(Integer)
  sched = Column(String)
  oldname = Column(String)
  notes = Column(String)

  @classmethod
  def get_distinct_classes(cls, **kw):
    # returns distinct list of all years in ascending order
    return sorted([x[0] for x in db_session.query(cls.name).distinct() if x[0] != None and x[0] != 0])
  
  @classmethod
  def get_distinct_class_years(cls, **kw):
    # returns distinct list of all years in ascending order
    return sorted([x[0] for x in db_session.query(cls.year).distinct() if x[0] != None and x[0] != 0])
  
  @classmethod
  def sum_class_size(cls, classes):
    sum = 0
    for i in classes:
      if i.size == None:
        continue
      sum += i.size
    return sum
  
  @classmethod
  def search_by_course(cls, search):
    search = search.split(", ")
    data = []

    for y in cls.get_distinct_class_years():
      temp = {"x_axis_time": y}
      searchSum = 0
      # arr = []
      # data[y] = {}

      for s in search:
        if s == " ":
          continue
        students = Course.query.filter(Course.name.contains(s), Course.year == y)
        n = cls.sum_class_size(students)
        temp[s] = n
        searchSum += n
        # data[y][s[5:]] = cls.sum_class_size(students)

      temp["sum"] = searchSum
      data.append(temp)
    return data


  # @classmethod
  # def get_classes(cls, **kw):
  #   ret = {}
  #   for c in Course.query.all():
  #     if c.size == None or c.size == 0:
  #       continue
  #     if c.name == None:
  #       continue
  #     if not c.year in ret:
  #       ret[c.year] = {c.name : c.size}
  #     else:
  #       ret[c.year].update({c.name : c.size})
  #   return ret
class Rost(Base):
  __tablename__ = 'rost'
  id = Column(Integer, primary_key=True) #not a true primary key
  studxid = Column(Integer)

class StudentLim(Base):
    __tablename__ = 'students_lim'
    studxid = Column(Integer, primary_key=True) # not a true primary key
    plan = Column(String)
    grad = Column(Integer)

    @classmethod
    def group_by_year(cls, **kw):
      return dict([(year, StudentLim.query.where(StudentLim.grad == year).count()) for year in cls.get_distinct_years()])

    @classmethod
    def group_by_year_and_college(cls, search):
      students = cls.query.all()
      year_and_college = dict([(year, {}) for year in cls.get_distinct_years()])
      for student in students:
        if search in student.plan:
          if str(student.grad) == '0' or student.grad == None:
            continue
          if student.plan not in year_and_college[student.grad]:
            year_and_college[student.grad][student.plan] = 1
          else:
            year_and_college[student.grad][student.plan] += 1
      return year_and_college

    @classmethod
    def sum_of_students(cls, search):
      raw = cls.group_by_year_and_college(search)
      students = {}
      queue = []
      for year in raw:
        sumation = sum(raw[year].values())
        queue.append(sumation)
      for year in raw:
        students[year] = {str(search): queue.pop(0)}
      return {"raw": raw, "data": students}

    @classmethod
    # URL ENCODING GOOGLE SEARCH
    def group_by_year_and_college_two_parameters(cls, search, search2):
      students = cls.query.all()
      year_and_college = dict([(year, {search:0, search2:0}) for year in cls.get_distinct_years()])
      for student in students:
        if search in student.plan:
          if str(student.grad) == '0' or student.grad == None:
            continue
          if search not in year_and_college[student.grad]:
            year_and_college[student.grad][search] = 1
          else:
            year_and_college[student.grad][search] += 1
        if search2 in student.plan:
          if str(student.grad) == '0' or student.grad == None:
            continue
          if search2 not in year_and_college[student.grad]:
            year_and_college[student.grad][search2] = 1
          else:
            year_and_college[student.grad][search2] += 1
      return year_and_college


# ONLY METHODS CURRENTLY IN USE
    @classmethod
    def get_distinct_years(cls, **kw):
      # returns distinct list of all years in ascending order
      return sorted([x[0] for x in db_session.query(cls.grad).distinct() if x[0] != None and x[0] != 0])

    @classmethod
    def multi_parameter_search_bar(cls, search):
      search = search.split(", ")
      arr = []

      for y in cls.get_distinct_years():
        temp = {"x_axis_time": y}
        searchSum = 0
        for s in search:
          n = StudentLim.query.filter(StudentLim.plan.contains(s), StudentLim.grad == y).count()
          temp[s] = n
          searchSum += n
        temp["sum"] = searchSum
        arr.append(temp)
      return arr

    @classmethod
    def multi_parameter_search_bar_table(cls, search, time):
      search = search.split(", ")
      arr = {}

      # for s in search:
      for s in search:
        n = StudentLim.query.filter(StudentLim.plan.contains(s), StudentLim.grad == time).with_entities(StudentLim.plan).all()
        for i in n:
          if i[0] in arr:
            arr[i[0]] += 1
          else:
            arr[i[0]] = 1
      return arr

    @classmethod
    def multi_param_search_line(cls, search):
      search = search.split(', ')
      arr = []
      for y in cls.get_distinct_years():
        for s in search:
          n = StudentLim.query.filter(StudentLim.plan.contains(s), StudentLim.grad == y).count()
          arr.append({"x_axis_time": y, "name": s, "y_axis_value": n})
      return arr

    @classmethod
    def show_count_per_year(cls, search, year):
      search = search.split(", ")
      raw = {}
      for s in search:
        students = StudentLim.query.filter(StudentLim.plan.contains(s), StudentLim.grad == year)
        for student in students:
          if not student.plan in raw:
            raw[student.plan] = 1
          else:
            raw[student.plan] += 1
      return raw