import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import * as styleProps  from '../ui/Styles';

export default class LoggerComponent extends React.Component {
	constructor (props) {
		super(props);

	}
	render () {
		return (
            <div>
                <Card style={styleProps.styles.cardDryRun}>
                    <CardText style={styleProps.styles.cardText}>
                        <h3 style={styleProps.styles.cardHeader}>Logger - view messages received on using import whonet file </h3>
                        <p> Import Message: {this.props.teiResponse.message} </p> 
                        <p> Status: {this.props.teiResponse.status}</p>
                        <p> Status Code: {this.props.teiResponse.httpStatusCode}</p>
                        <p> Response Type: {this.props.teiResponse.response.importSummaries.map( val => val.responseType)}</p>
                        <p> Status: {this.props.teiResponse.response.importSummaries.map( val => val.status)}</p>
                        <p> Enrollments Imported: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.imported)}, Ignored: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.ignored)}, Deleted: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.deleted)}, Updated: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.updated)}, Total: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.total)} </p> 
                        <p> Events Imported: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.importSummaries.map( val => val.events.imported))}, Ignored: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.importSummaries.map( val => val.events.ignored))}, Deleted: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.importSummaries.map( val => val.events.deleted))},
                        	Updated: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.importSummaries.map( val => val.events.updated))}, Total: {this.props.teiResponse.response.importSummaries.map( val => val.enrollments.importSummaries.map( val => val.events.total))}
                          </p> 
                    </CardText>
                </Card>
            </div>
		);
	}
}
