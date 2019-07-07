import React from 'react';
import {connect} from 'react-redux';
import Papa from 'papaparse';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import {Button} from '@dhis2/d2-ui-core';
import {InputField} from '@dhis2/d2-ui-core';
import swal from 'sweetalert';
import LinearProgress from '../components/ui/LinearProgress';
import MappingModal from '../components/settings/MappingModal';
import HelpModal from '../components/settings/HelpModal';
import SettingsIcon from '@material-ui/icons/SettingsApplicationsRounded';
import Fab from '@material-ui/core/Fab';
import ViewSupportIcon from '@material-ui/icons/HelpOutlineRounded';
import * as config  from '../config/Config';
import * as styleProps from '../components/ui/Styles';
import * as actionTypes from '../constants/actions.js';
import { formatDate } from '../components/helpers/DateFormat';
import { hash } from '../components/helpers/Hash';
import LoggerComponent from '../components/logger/LoggerComponent';
import CsvMappingColumns from '../components/logger/CsvMappingColumns';
import ImportResults from '../components/import-results/ImportResults';
import axios from 'axios';
import { 
    getPrograms,
    getAttributes,
    isDuplicate, 
    createTrackedEntity,
    updateTrackedEntity,
    checkOrgUnitInProgram,
} from '../components/api/API';

styleProps.styles.cardWide = Object.assign({}, styleProps.styles.card, {
  width: (styleProps.styles.card.width * 3) + (styleProps.styles.card.margin * 4),
});

class WHONETFileReader extends React.Component {
    constructor(props) {
        super(props);
        const d2        = props.d2;
        this.state = {
            csvfile     : undefined,
            orgUnitField: '',
            d2          : d2,        
            loading     : false,
            error       : false,
            userOrgUnitName: props.orgUnit,
            fileFormatValue: '',
            isSettingModalOpen: false,
            isHelpModalOpen: false,
            userRoles  : "",
            userAuthority : "",             
            dataElements: [],
            attributes: [],
            counter: 0,
            emptyTrackedEntityPayload: false,
            dryRunResult: [],
            teiResponse: [],
            teiResponseString: "",
            mappingCsvData: [],
            duplicateStatus: "",
        };
        this.uploadCSVFile = this.uploadCSVFile.bind(this);
            
    }
    componentWillMount(){
        /**
         * @param {currentUser} input
         * @returns Current user roles and organization unit 
         * {getPrograms()} returns all the dataElements under whonet program
         * {getAttributes()} returns all the attributes
         */

        let symbolValueCurrentUser = Object.getOwnPropertySymbols(this.props.d2.currentUser);
        let userRoles              = this.props.d2.currentUser[symbolValueCurrentUser[0]];
        //let userOrgUnitId          = this.props.d2.currentUser[symbolValueCurrentUser[1]];
        // User authorities checking
        let symbolValueUserAuthorities = Object.getOwnPropertySymbols(this.props.d2.currentUser.authorities);
        let userAuthorities            = this.props.d2.currentUser.authorities[symbolValueUserAuthorities[0]]
        let userAuthoritiesValues      = userAuthorities.values();        
        for (var authority = userAuthoritiesValues.next().value; authority = userAuthoritiesValues.next().value;) {
            if(authority === "ALL"){
                this.setState({
                    userRoles: userRoles[0],
                    userAuthority: authority,
                });
            }
        } 

        let self = this;


        getPrograms().then((response) => {
          if(typeof response!== 'undefined'){
              self.setState({
                dataElements : response.data.programs[0].programStages[0].programStageDataElements       
              }); 
          }  
          
        });

        getAttributes().then((response) => {    
        if(typeof response!== 'undefined'){        
          self.setState({
            attributes   : response.data.trackedEntityAttributes
          });
        }  
        });
         
    }
    handleChangeFileUpload = event => {

        /**
        * Selected file format checking
        * Accept only .csv file format
        * Update setter 
        */ 
        let filename     = event.target.files[0].name;
        let splittedName = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        if (splittedName !== 'csv') {
            swal("Sorry! Please upload correct file format! Accepted file fortmat is CSV. Your selected file name: "+event.target.files[0].name + " Last Modified: "+ event.target.files[0].lastModified + " Size: "+ event.target.files[0].size + " File type: "+ event.target.files[0].type, {
                icon: "warning",
            });
        }
        this.setState({
          csvfile: event.target.files[0],
          fileFormatValue: splittedName
        });
        /**
        * @{generateCsvMappingTable} returns the parsed records of selected csv file
        */
        Papa.parse(event.target.files[0], {
          complete: this.generateCsvMappingTable,
          header  : true
        });  

        console.log("Your selected file: ", event.target.files[0].name);
    };
    /**
    * @input the selected parsed csv file data
    * @{mappingCsvData} set CSV file columns
    */
    generateCsvMappingTable = (input) =>{
        let csvData = input.data;
        this.setState({
            mappingCsvData: csvData[0] 
        });
    }
    /**
    * Parse select csv file
    * CSV file header true
    * @returns loader true
    */
    importCSVFile = (input) => {        
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
          complete: this.uploadCSVFile,
          header  : true
        });
        this.setState({
            loading: true,
        });
    };

    /**
    * @input {result}-selected parsed csv file
    * {orgUnitId}-get the selected org unit UID
    * {resultMappedElement} returns the mapped elements
    * {attributesFilterResult} returns the mapped attributes
    */

    async uploadCSVFile(result) {
        let csvData              = result.data;    
        // let teiPayloadString     = [];
        let elementId    = "";
        let attributeId  = "";
        let elementValue = "";
        let orgUnitId = document.getElementById('selectedOrgUnitId').value;
        let trackedEntityJson, eventDate;

        const totalData = await csvData.reduce( async (totalData, currentCsvData) => {
          
          let teiPayload    = [];    
          let eventsPayload = []; 

          totalData.information = Object.entries(currentCsvData).reduce( async (total,[columnName, columnValue]) => { 

            let resultMappedElement = this.state.dataElements.filter(function(element) {                
              return element.dataElement.code === columnName                
            }); 
                
            /** 
             * @return {matchResult} the column value which is date or not, if date then formate it as `yyyy-mm-dd`
             * config.dateColumn will return the 'Date' column name from config file. Formate date column as yyyy-mm-dd for `eventDate` 
            */
            if(resultMappedElement.length >= 1){
                let matchResult = columnValue.match(/\//g);
                if(matchResult !== null && matchResult.length === 2){
                    elementValue = formatDate(columnValue);
                } else {
                    elementValue = columnValue.replace(/[=><_]/gi, '');
                } 
                elementId    = resultMappedElement[0].dataElement.id;
                eventsPayload.push({"dataElement": elementId, "value": elementValue});   
            }

            if(columnName === config.dateColumn){
              eventDate = formatDate(columnValue.replace(/[=><_]/gi, ''));
            } 

            /**
            * {attributesFilterResult} matched columns with csv file
            * {matchResult} finds whether the input value is date or not. If it is date then convert it as `yyyy-mm-dd`
            * {attributeValue} returns the value with has if it is patient-id or registration number
            * {attributeId} returns the tei atrribute id
            * {teiPayload} contains the level-1 json payload
            * {isDuplicate} check the existing record
            * @returns {null} end iteration
            */   
            //console.log("this.state.attributes: ", this.state.attributes);
            let attributesFilterResult = this.state.attributes.filter(function(attribute) {
                return attribute.code === columnName;                             
            });

            if(attributesFilterResult.length >= 1){
              let attributeValue;
              attributeId = attributesFilterResult[0].id;
              let duplicateData = "";
              let matchResult = columnValue.match(/\//g);
              
              if (matchResult !== null && matchResult.length === 2){
                  attributeValue = formatDate(columnValue);
              } 

              if(columnName === config.patientIdColumn ){
                const input = hash(columnValue.replace(/[=><_]/gi, ''));
                console.log("input: ", input);
                // const response = await isDuplicate( input, orgUnitId, attributeId);
                // console.log("response.data: ", response.data);
                /*if( response.data.trackedEntityInstances.length > 0 ){

                  const duplicateValue = response.data.trackedEntityInstances[0].attributes; 

                  total = duplicateValue.filter(function(data){
                    console.log("data: ", data);
                    //return data.value === input;
                  });

                  console.log("total: ", total);

                }*/
                attributeValue = hash(columnValue.replace(/[=><_]/gi, ''));
              } else {
                attributeValue = columnValue.replace(/[=><_]/gi, '');
              }
              console.log({"attribute": attributeId, "value": attributeValue});
              teiPayload.push({"attribute": attributeId, "value": attributeValue});
            }  

            return total;
          },{}); // End of csv iterations 

          // console.log({result})
          if( teiPayload.length !== 0 || eventsPayload.length !==0 ){
              totalData.teiPayloadString.push({"trackedEntityType": config.trackedEntityType,"orgUnit": orgUnitId,"attributes": teiPayload,"enrollments":[{"orgUnit":orgUnitId,"program":config.programId,"enrollmentDate": eventDate,"incidentDate": eventDate,"events":[{"program":config.programId,"orgUnit":orgUnitId,"eventDate": eventDate,"status":"ACTIVE","programStage":config.programStage,"dataValues":eventsPayload}]}]});
          } 
          // else {
            // console.log({totalData, result})
            // totalData.updatePayload.push({"trackedEntityType": config.trackedEntityType,"orgUnit": orgUnitId,"attributes": totalData.information,"enrollments":[{"orgUnit":orgUnitId,"program":config.programId,"enrollmentDate": eventDate,"incidentDate": eventDate,"events":[{"program":config.programId,"orgUnit":orgUnitId,"eventDate": eventDate,"status":"ACTIVE","programStage":config.programStage,"dataValues":eventsPayload}]}]})
          // }

         return totalData;
        }, { teiPayloadString: [], updatePayload: [], information: {} } )

        console.log("totalData: ", totalData)

        /**
        * {trackedEntityJson} returns final json payload
        * Check whether the trackedEntityInstances is not undefined or empty json
        * {trackedEntityJson} sends to `API` component 
        * Sending tracked entity json payload
        * Check response status for tei is `OK`      
        */

        trackedEntityJson = '{"trackedEntityInstances": '+JSON.stringify(totalData.teiPayloadString)+'}';

        console.log("Final trackedEntityJson payload: ", trackedEntityJson);

        if (totalData.teiPayloadString.length > 0) {

          try {
            const responseData =  await createTrackedEntity(trackedEntityJson);
            console.log("responseData: ", responseData)
            this.setState({
              teiResponse: responseData.data,
              teiResponseString: JSON.stringify(responseData.data),

            })

            if(responseData.data.httpStatus === "OK" ){
              swal("Successfully uploaded WHONET data!", {
                  icon: "success",
              });
              this.setState({
                  loading: false
              });
            } else {
              swal("Sorry! Unable to import WHONET file!", {
                  icon: "warning",
              });
              this.setState({
                  loading: false
              });
            }
          } catch( err ) {
            console.log({err})
          }
 

            /*
            .then(response => {
                this.setState({ 
                    teiResponse: response.data,
                    teiResponseString: JSON.stringify(response.data),
                });
                if(response.data.httpStatus === "OK" ){
                    swal("Successfully uploaded WHONET data!", {
                        icon: "success",
                    });
                    this.setState({
                        loading: false
                    });
                } else {
                    swal("Sorry! Unable to import WHONET file!", {
                        icon: "warning",
                    });
                    this.setState({
                        loading: false
                    });
                } 
            }).catch(error => {

                if (error.response) {
                    swal("Something went wrong! "+ error.response.data.message, {
                        icon: "warning",
                    });
                    this.setState({ 
                        teiResponse: error.response.data,
                        teiResponseString: JSON.stringify(error.response.data),
                        loading: false
                    });
                } else if (error.request) {
                    console.log(error.request);
                } else {
                  console.log('Error', error.message);
                }
                console.log(error.config);
            });
            */
        } else {
            swal("Sorry! Your prepared JSON payload is empty. Please check your CSV file data.", {
                icon: "warning",
            });
            this.setState({
                loading: false
            });
        }  
        
    }

    /**
    * @input {field, value}-text field and value
    * @set {field}-value
    */
    onChangeValue = (field, value) => {
        this.setState({ [field]: value });
    };

    /**
    * {orgUnitId} returns selected org unit from left sidebar
    * {checkOrgUnitInProgram} returns whether the selected org unit assigned or not
    * If does not assign then prevent the file upload
    */
    fileUploadPreAlert = () =>{

        let orgUnitId = document.getElementById('selectedOrgUnitId').value;
        if(typeof orgUnitId === 'undefined' || orgUnitId === null || orgUnitId === ''){
            swal({
                title: "Sorry! Please select organisation unit first!",
                icon: "warning",
            });
        } else if(typeof this.state.csvfile === 'undefined'){
            swal({
                title: "Sorry! You forgot to select your file!",
                icon: "warning",
            });
        } else if(this.state.fileFormatValue !== 'csv'){
            swal({
                title: "Sorry! You have selected wrong file format!",
                icon: "warning",
            });
        } else {
            swal({
              title: "Are you sure want to upload WHONET file?",
              //text: "Once uploaded, you will not be able to recover WHONET-DHIS2 data!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then((willUpload) => {
                
              if (willUpload) {
                checkOrgUnitInProgram(orgUnitId).then( result =>{
                    if(typeof result !== 'undefined'){
                        if( result.length > 0){
                           this.importCSVFile("import");   
                        }                        
                    } else {
                        swal({
                            title: "Sorry your selected org unit was not assigned in this program. Please assign first!",
                            icon: "error",
                        });
                    }
                });

              } else {
                swal({
                    title: "Your uploading file is safe!",
                    icon: "success",
                });
              }
            });
        }   

        
    }
    /**
    * @returns isSettingModalOpen true
    */
    handleSettingModal = () => {
        this.setState({ 
            isSettingModalOpen: !this.state.isSettingModalOpen,
        });
    };

    /**
    * @returns isHelpModalOpen true
    */
    handleHelpModal = () => {
        this.setState({ 
            isHelpModalOpen:  !this.state.isHelpModalOpen,
        });
    };

    render() {
        // console.log("CTR: ", this.props.ctr);
        
        let spinner, modal, userAuthority, teiResponse, logger;
        if(this.state.loading){
          spinner = <LinearProgress />
        } 
        if(this.state.isSettingModalOpen){
          modal = <MappingModal isModalOpen={this.state.isSettingModalOpen}  handleModal={this.handleSettingModal} />
        } 
        if(this.state.userAuthority === 'ALL'){
          userAuthority = <Fab color='primary' aria-label="Edit" onClick={this.handleSettingModal} style={styleProps.styles.helpModalPosition}>
            <SettingsIcon style={styleProps.styles.settingIcon} />
          </Fab>;
        } 
        
        if( Object.keys(this.state.mappingCsvData).length > 0 || Object.entries(this.state.mappingCsvData).length > 0 ){
            logger = <CsvMappingColumns csvData = {this.state.mappingCsvData} dataElements={this.state.dataElements} attributes={this.state.attributes}/>;
        }
        if( Object.keys(this.state.teiResponse).length > 0 || Object.entries(this.state.teiResponse).length > 0 ){
  
            teiResponse = <ImportResults teiResponse={this.state.teiResponse} />
            logger = <LoggerComponent teiResponse={this.state.teiResponse}  teiResponseString={this.state.teiResponseString}/>
        }
        if(this.state.isHelpModalOpen){
            modal = <HelpModal isModalOpen={this.state.isHelpModalOpen}  handleModal={this.handleHelpModal} />
        }
        let helpModal = <Fab color="primary" aria-label="Edit" onClick={this.handleHelpModal} style={styleProps.styles.helpModalPosition}>
                       <ViewSupportIcon />
                      </Fab>

    return (
      <div>
          <Card style={styleProps.styles.card}>
              <CardText style={styleProps.styles.cardText}>
                  
                  <h3 style={styleProps.styles.cardHeader}>IMPORT WHONET CSV FILE! 
                  { userAuthority }
                  </h3> 

                  <InputField
                    label="Organisation Unit"
                    value={this.props.orgUnit}
                    disabled
                    onChange={(value) => this.onChangeValue("orgUnitField", value)}
                    name = "selectedOrgUnit"
                  /><input
                    type="hidden" id="selectedOrgUnitId" value ={this.props.orgUnitId}
                    />
                  <div style={styleProps.styles.buttonPosition}></div>

                  <input
                    type="file"
                    ref={input => {
                      this.filesInput = input;
                    }}
                    name="file"
                    placeholder={null}
                    onChange={this.handleChangeFileUpload}                  
                    accept=".csv"
                  />
                  <div style={styleProps.styles.buttonPosition}></div>

                  <Button type="submit" raised color='primary' onClick={this.fileUploadPreAlert}>IMPORT</Button>

                  <br /><br />                  

              </CardText>
              <CardText style={styleProps.styles.cardText}>
                {spinner} 
              </CardText>
              {modal}
            </Card>
            <Card style={styleProps.styles.card}>
                <CardText style={styleProps.styles.cardText}>
                <h3 style={styleProps.styles.cardHeader}>IMPORT RESULT {helpModal}</h3>
                {teiResponse}
                </CardText>
            </Card>
            {logger}
      </div>

    );
  }
}
/**
* Redux framework has introduced
* This below section is under development
*/
const mapStateToProps = state =>{
    return {
        ctr: state.counter,
    };    
};

const mapToDispatchToProps =  (dispatch) =>{
    return {
        fileUploadPreAlert: () => dispatch({type: actionTypes.UPLOAD_PRE_ALERT}), 
    };
}
export default connect(mapStateToProps, mapToDispatchToProps)(WHONETFileReader);
