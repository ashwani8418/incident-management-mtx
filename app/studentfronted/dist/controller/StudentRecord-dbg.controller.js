sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/Button"
], (Controller, MessageToast, Dialog, SimpleForm, Label, Input, DatePicker, Button) => {
    "use strict";

    return Controller.extend("ns.studentfronted.controller.StudentRecord", {
        onInit() {
        },

        onPressAddRecord: async function () {
            if (!this.oDialog) {
                this.oDialog = await this.loadFragment({
                    name: "ns.studentfronted.fragments.AddRecord"
                });
                this.oDialog.open()
            } else {
                this.oDialog.open()
            }
        },

        onCloseDialog: function () {
            let oDialog = this.byId("AddRecord");
            oDialog.close();
            console.log("oDialog", oDialog);
        },

        calculateAge: function (oEvent) {
            let oDatePicker = oEvent.getSource();
            let ODateValue = oDatePicker.getValue();

            console.log(typeof ODateValue);

            // Converting Selected Date from String datatype to Date Date Format;
            let oBirthDate = new Date(ODateValue);
            let currentDate = new Date();

            console.log("oBirthDate ", oBirthDate);
            let age = undefined;

            let personBirthYear = oBirthDate.getFullYear();
            let personBirthMonth = oBirthDate.getMonth();
            let personBirthDay = oBirthDate.getDay();

            let currentYear = currentDate.getFullYear();
            let currentMonth = currentDate.getMonth();
            let currentDay = currentDate.getDay();

            age = currentYear - personBirthYear;

            let monthDiff = currentMonth - personBirthMonth;

            if (monthDiff < 0 || (monthDiff === 0 && currentDay < personBirthDay)) {
                age--;
            }

            console.log("age", age);

            let ageInput = this.byId("inputAge")

            ageInput.setValue(age);
            ageInput.setVisible(true);
        },

        onSubmitAddRecord: async function () {
            try {
                let sFirstName = this.byId("inputFirstName").getValue();
                let sLastName = this.byId("inputLastName").getValue();
                let sEmail = this.byId("inputEmail").getValue();
                let sPhoneNumber = this.byId("inputPhone").getValue();
                let sDateofBirth = this.byId("inputDateOfBirth").getValue();
                let sAge = this.byId("inputAge").getValue();

                let studentData = {
                    firstName: sFirstName,
                    lastName: sLastName,
                    email: sEmail,
                    phone: sPhoneNumber,
                    dateOfBirth: sDateofBirth,
                    age: parseInt(sAge)
                }
                console.log("studentData", studentData);

                this.onCloseDialog();

                // Getting Model of the View 
                let oModel = this.getView().getModel();

                //bindList is a method to post Data bindList("/pathName Or Entity")
                let oBinding = oModel.bindList("/studentsRecord");
                // create is a function to insert Data into the table.
                await oBinding.create(studentData);
                MessageToast.show("Data Successful Submitted!")
                // To fetch the Latest Record from the Table after POST Operation
                oModel.refresh();


            } catch (error) {
                MessageToast.show("Some Error Occured");
            }
        },

        onPressUpdate: function () {
            let that = this
            let studTable = this.byId("studentTable");
            let selectedRow = studTable.getSelectedItem().getBindingContext().getObject();
            let studentDataModel = this.getView().getModel();

            console.log("studTable", selectedRow);

            let ID = selectedRow.ID;
            let sFirstName = selectedRow.firstName;
            let sLastName = selectedRow.lastName;
            let sEmail = selectedRow.email;
            let sPhoneNumber = selectedRow.phone;
            let sDateofBirth = selectedRow.dateOfBirth;
            let sAge = selectedRow.age;

            console.log("ID: ", ID);
            console.log("First Name: ", sFirstName);
            console.log("Last Name: ", sLastName);
            console.log("Email: ", sEmail);
            console.log("Phone Number: ", sPhoneNumber);
            console.log("Date of Birth: ", sDateofBirth);
            console.log("Age: ", sAge);


            let oForm = new SimpleForm({
                content: [
                    new Label({
                        text: "ID"
                    }),
                    new Input({
                        id: "inputID",
                        value: "",
                        editable: false
                    }).setValue(ID),
                    new Label({

                        text: "First Name"
                    }),
                    new Input({
                        id: "inputFirstName",
                        value: ""
                    }).setValue(sFirstName),
                    new Label({
                        text: "Last Name"
                    }),
                    new Input({
                        id: "inputLastName",
                        value: ""
                    }).setValue(sLastName),
                    new Label({
                        text: "Email"
                    }),
                    new Input({
                        id: "inputEmail",
                        value: ""
                    }).setValue(sEmail),
                    new Label({
                        text: "Phone Number"
                    }),
                    new Input({
                        id: "inputPhoneNumber",
                        value: ""
                    }).setValue(sPhoneNumber),
                    new Label({
                        text: "Date of Birth"
                    }),
                    new DatePicker({
                        id: "inputDateOfBirth",
                        value: "",
                        displayFormat: "YYYY-MM-dd",
                        valueFormat: "YYYY-MM-dd"
                    }).setValue(sDateofBirth),
                    new Label({
                        text: "Age"
                    }),
                    new Input({
                        id: "inputAge",
                        value: ""
                    }).setValue(sAge)
                ]
            });

            let updateDialog = new Dialog({
                title: "Update Record",
                content: oForm,
                beginButton: new Button({
                    text: "Save",
                    type: "Emphasized",
                    press: async function () {
                        let uID = sap.ui.getCore().byId("inputID").getValue();
                        let uFirstName = sap.ui.getCore().byId("inputFirstName").getValue();
                        let uLastName = sap.ui.getCore().byId("inputLastName").getValue();
                        let uEmail = sap.ui.getCore().byId("inputEmail").getValue();
                        let uPhoneNumber = sap.ui.getCore().byId("inputPhoneNumber").getValue();
                        let uDateOfBirth = sap.ui.getCore().byId("inputDateOfBirth").getValue();
                        let uAge = sap.ui.getCore().byId("inputAge").getValue();

                        let oBinding = studentDataModel.bindList("/studentsRecord");

                        await oBinding.requestContexts().then( function(aContexts){
                            for(let i = 0; i < aContexts.length; i++){
                                
                                if(aContexts[i].getProperty("ID") == uID){
                                    aContexts[i].setProperty("firstName", uFirstName);
                                    aContexts[i].setProperty("lastName", uLastName);
                                    aContexts[i].setProperty("email", uEmail);
                                    aContexts[i].setProperty("phone", uPhoneNumber);
                                    aContexts[i].setProperty("dateOfBirth", uDateOfBirth);
                                    aContexts[i].setProperty("age", parseInt(uAge));

                                }
                            }
                        })
                        
                        studentDataModel.refresh();
                        updateDialog.close();
                        updateDialog.destroy();
                        
                        
                    }
                }),
                endButton: new Button({
                    text: "Close",
                    press: function () {
                        updateDialog.close();
                        updateDialog.destroy();
                        
                    }
                })
            })

            updateDialog.open();

        },

        onPressDelete: function () {

        }

    });
});

