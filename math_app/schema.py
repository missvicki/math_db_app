# https://docs.graphene-python.org/projects/sqlalchemy/en/latest/tutorial/

import graphene 
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from .models import Course as CourseModel, Rost as RostModel, StudentLim as StudentLimModel

class Course(SQLAlchemyObjectType):
  actual_id = graphene.String(source='id') # gets the actual id from the db, called as actualId from the query
  class Meta:
    model=CourseModel
    interfaces = (relay.Node,)

class Rost(SQLAlchemyObjectType):
  actual_id = graphene.String(source='id') # gets the actual id from the db, called as actualId from the query

  class Meta:
    model=RostModel
    interfaces = (relay.Node,)

class StudentLim(SQLAlchemyObjectType):
  class Meta:
    model=StudentLimModel
    interfaces = (relay.Node,)
  
class Query(graphene.ObjectType):
  node = relay.Node.Field()
  # Allows sorting over multiple columns, by default over the primary key
  all_courses = SQLAlchemyConnectionField(Course.connection)
  all_rosts = SQLAlchemyConnectionField(Rost.connection)
  all_student_lims = SQLAlchemyConnectionField(StudentLim.connection)



schema = graphene.Schema(query=Query)

