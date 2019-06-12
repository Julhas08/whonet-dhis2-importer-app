import React from 'react';
import PropTypes from 'prop-types';

import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import SingleSelection from './org-unit-tree/single-selection';
import WhonetController from '../../controllers/WhonetController';

const styles = {
	card: {
		margin: 16,
        width: 350,
		minHeight: 300,
		float: 'left',
		transition: 'all 175ms ease-out',
	},
	cardText: {
		paddingTop: 0,
	},
	cardHeader: {
		padding: '0 16px 16px',
		margin: '16px -16px',
		borderBottom: '1px solid #eeeeee',
	},
	customLabel: {
		fontStyle: 'italic',
	},
	customLabelSelected: {
		color: 'blue',
		weight: 900,
	},
};

styles.cardWide = Object.assign({}, styles.card, {
	width: (styles.card.width * 3) + (styles.card.margin * 4),
});

export default class OrgUnitTreeComponent extends React.Component {
	constructor (props) {
		super(props);

		const d2 = props.d2;
		this.state = {
			d2     : d2,
			roots  : [],
			root   : undefined,
			preRoot: undefined,
            listDataFromChild: null,
            userOrgUnitId  : '',
            userOrgUnitName: '',
		};

		const childFields = 'id,path,displayName,children::isNotEmpty';

		d2.models.organisationUnits
			.list({
				paging: false,
				level: 1,
				fields: childFields,
			})
			.then(rootLevel => rootLevel.toArray()[0])
			.then((loadRootUnit) => {
				this.setState({
					root: loadRootUnit,
					roots: []
				})
			})
			.then(() => Promise.all([
				d2.models.organisationUnits.get('ANGhR1pa8I5', { fields: childFields }),
				d2.models.organisationUnits.get('ANGhR1pa8I5', { fields: childFields }),
                /*d2.models.organisationUnits.get('at6UHUQatSo', { fields: childFields }),
                d2.models.organisationUnits.get('fdc6uOvgoji', { fields: childFields }),*/
				d2.models.organisationUnits.list({
					paging: false,
					level: 1,
					fields: 'id,path,displayName,children[id,path,displayName,children::isNotEmpty]',
				}),
			]))
			.then(roots => [roots[0], roots[1], roots[2].toArray()[0]])
			.then((roots) => {
				this.setState({
					roots
				});
				d2.models.organisationUnits.list({
					paging: false,
					level: 1,
					fields: `id,path,displayName,children[id,path,displayName,children[${childFields}]]`,
				})
				.then(preRoot => preRoot.toArray()[0])
				.then((preRoot) => {
					this.setState({
						preRoot
					})
				});
			})


	}
    orgUnitCallback = (dataFromChild) => {
        if(typeof dataFromChild !== undefined || dataFromChild !==null){
            const childFields = 'id,path,displayName,children::isNotEmpty';
               this.state.d2.models.organisationUnits
                .list({
                    paging: false,
                    level : 1,
                    fields: childFields,
                })
                .then(() => Promise.all([
                    this.state.d2.models.organisationUnits.get(dataFromChild, { fields: childFields }),
                ]))
                .then(roots =>{ 
                    this.setState({
                        userOrgUnitName: roots[0].displayName,
                        userOrgUnitId  : roots[0].id,
                    })
                })
            
            
        }
        this.setState({ listDataFromChild: dataFromChild });
        // console.log("listDataFromChild: ", this.state.listDataFromChild);
    }
	render () {
		const { root, roots, preRoot } = this.state;

		if (!root || !roots || !preRoot) {
			return null;
		}

		return (
            <div>
                <Card style={styles.card}>
                    <CardText style={styles.cardText}>
                        <h3 style={styles.cardHeader}>Select Organization Unit</h3>
                        <SingleSelection root={root} callbackFromParent={this.orgUnitCallback} />
                    </CardText>
                </Card>
                <WhonetController d2={this.state.d2} orgUnitId={this.state.userOrgUnitId} orgUnit={this.state.userOrgUnitName}/>

            </div>
		);
	}
}

OrgUnitTreeComponent.propTypes = {
    d2: PropTypes.object.isRequired,
};
