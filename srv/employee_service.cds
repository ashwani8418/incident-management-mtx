using { trainingprojectdb  } from '../db/employee_schema';

service trainingprojectSrv{


    entity studentsRecord as projection on trainingprojectdb.studentsRecord;

}