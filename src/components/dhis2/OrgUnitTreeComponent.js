import React from 'react';
import PropTypes from 'prop-types';
import * as styleProps from '../ui/Styles';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import SingleSelection from './org-unit-tree/OrgUnitSingleSelection';
import WhonetController from '../../controllers/WhonetController';
import CustomOrgUnitTreeView from './custom-orgunit-tree/CustomOrgUnitTreeView';
import CustomTree from './custom-orgunit-tree/CustomTree';
import 'regenerator-runtime/runtime';
import { 
    getMe,
} from '../api/API';


export default class OrgUnitTreeComponent extends React.Component {
	constructor (props) {
		super(props);

		const d2 = props.d2;
		this.state = {
			d2     : d2,
			roots  : [],
			root   : undefined,
			preRoot: undefined,
      d2TreeDataFromChild: null,
      customTreeDataFromChild: null,
      userOrgUnitId  : [],
      userOrgUnitName: '',
      currentUserOrgUnits: "",
      orgUnitLevel: [],
      userAuthority: "", 
      levelOne: false,
      customTree: false,
      tree: [],
		};	
		/**
		* @{symbolValueCurrentUser}-returns the current user symbol values 
		* @{userOrgUnitId} returns current user all assigned org units 
		*/
		let symbolValueCurrentUser = Object.getOwnPropertySymbols(this.state.d2.currentUser);
		let userOrgUnitId = this.state.d2.currentUser[symbolValueCurrentUser[1]];
		this.setState({ userOrgUnitId: userOrgUnitId });        

    /**
    * @childFields sets the api end points 
    * @{d2.models.organisationUnits} sets the d2-ui org unit tree
    */
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

		/**
		* @{getMe()} returns the current user all org units with org unit id,name and parent id
		* @currentUserOrgUnits-sets all org units
		* @orgUnitLevel returns the 
		*/	

    let orgUnitLevel1 = [], orgUnitLevel2 = [], orgUnitLevel3 = [];

		getMe().then( me =>{
			this.setState({currentUserOrgUnits: me.data.organisationUnits});
			let total = {};
			let data = me.data.organisationUnits;
			const len = data.length;

			// generate all data with children
			for(let i=0; i<len; i++) {
			  const current = data[i];
			  total[current.id] = total[current.id] || {};

			  total[current.id] = {...total[current.id], ...current};

			  if( current.parent ) {
			    total[current.parent.id] = total[current.parent.id] || {};
			    total[current.parent.id]["children"] = total[current.parent.id]["children"] && typeof total[current.parent.id]["children"] === "boolean" ? [] : total[current.parent.id]["children"] ? total[current.parent.id]["children"] : [];
			    
			    total[current.parent.id]["children"].push(current);
			  }
			}
			 
			const value = {};
			// set children data into parent
			for(let key in total) {
			  if( total[key].parent ) {
			    total[total[key].parent.id] = total[total[key].parent.id] || {};
			    findChildren(total[key], total);
			    delete total[key];
			  }
			}

			// find parent
			function findChildren(obj, total) {
			  for(let key in total) {
			    if( obj.parent.id === total[key].id ) {
			      total[key]['children'] = total[key]['children'] && typeof total[key]['children'] === "boolean" ? [] :  total[key]['children'];
			      total[key]['children'].push( obj);
			    }
			    if( total[key].childrenList && total[key].childrenList.length ) {
			      findChildren(obj, total[key].childrenList)
			    }
			  }
			}

			for(let key in total) {
			  if(Object.keys( total[key] ).length === 0) delete  total[key];
			}
			// let tree = JSON.stringify(total['ANGhR1pa8I5'], null, 2);
			let tree = JSON.stringify(total['ANGhR1pa8I5'], null, 2);
			//console.log("me.data.organisationUnits[i]: ", JSON.stringify(me.data.organisationUnits));
			let id1, name1, level1=[], id2, name2, level2=[], id3, name3, level3=[];
			var rootTreeJson = [];
			var rootTreeJson1 = [];
			for (var i = 0; i < me.data.organisationUnits.length; i++) {
				if(me.data.organisationUnits[i].level === 1){

					this.setState({levelOne: true});
					level1.push({
						"id": me.data.organisationUnits[i].id,
						"name": me.data.organisationUnits[i].name,
						"children": me.data.organisationUnits[i].children,
						"parent": me.data.organisationUnits[i].parent
					});

				}  
				if(me.data.organisationUnits[i].level === 2){
					level2.push({
						"id": me.data.organisationUnits[i].id,
						"name": me.data.organisationUnits[i].name,
						"children": me.data.organisationUnits[i].children,
						"parent": me.data.organisationUnits[i].parent
					});
				}

				if(me.data.organisationUnits[i].level === 3){
					let children3 = {
						"id": me.data.organisationUnits[i].id,
						"name": me.data.organisationUnits[i].name,
					};
					level3.push({
						"id": me.data.organisationUnits[i].id,
						"name": me.data.organisationUnits[i].name,
						"parent": me.data.organisationUnits[i].parent
					});
					orgUnitLevel3.push(children3);
				}

			}
			if(orgUnitLevel3 !== '' || typeof orgUnitLevel3 !== 'undefined') {
				this.setState({ orgUnitLevel: orgUnitLevel3 });				
			}	
			
			
			
			this.setState({ orgUnitLevel: tree });	
			this.setState({ tree: tree });

		});
	}

	/**
	* @symbolValueUserAuthorities returns the current user all authorities
	* @userAuthoritiesValues store all authorities values
	* @userAuthority returns the `ALL` authority type
	*/
	componentWillMount(){
		
		let symbolValueUserAuthorities = Object.getOwnPropertySymbols(this.props.d2.currentUser.authorities);
    let userAuthorities            = this.props.d2.currentUser.authorities[symbolValueUserAuthorities[0]]
    let userAuthoritiesValues      = userAuthorities.values();        
    for (var authority = userAuthoritiesValues.next().value; authority = userAuthoritiesValues.next().value;) {
       
        if(authority === "ALL"){
            this.setState({
                userAuthority: authority,
            });
        }
    }        
		
	}
	/**
  * @d2OrgUnitCallback() getbacks the callback value from the D2 framwork org unit selection
  * @{d2OrgUnitCallback} returns listDataFromChild value
  */
  d2OrgUnitCallback = (dataFromChild) => {
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
    this.setState({ d2TreeDataFromChild: dataFromChild });
	}

  /**
  * @customOrgUnitCallback() is using for call back. It needs to build custom tree for a specific user roles 
  * @{customOrgUnitCallback} returns listDataFromChild value
  */
  customOrgUnitCallback = (dataFromChild) => {
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
      this.setState({ customTreeDataFromChild: dataFromChild });
  }

	render () {
		const { root, roots, preRoot } = this.state;
		if (!root || !roots || !preRoot) {
			return null;
		}
		/**
		* @{d2OrgUnit}-returns the d2-ui based org unit tree when a specific user have org unit root level or level-1 access
		* @{customOrgUnit}-display only the assigned org units which has developed as custom
		*/
		let customOrgUnit, d2OrgUnit, customTree;
		if(this.state.userAuthority === 'ALL' && this.state.levelOne){
			d2OrgUnit = <SingleSelection root={root} callbackFromParent={this.d2OrgUnitCallback} />;
		} else {
			if(typeof this.state.orgUnitLevel !== 'undefined' || this.state.orgUnitLevel !== ''){				
				customOrgUnit = <CustomOrgUnitTreeView orgUnits = {this.state.orgUnitLevel} callbackFromParent={this.customOrgUnitCallback}/>
				
			}
		}
		if(this.state.customTree && this.state.tree.length >0 ){
			
  		let node =this.state.tree;
			customTree = <CustomTree node={node}/>
		}
		// console.log("this.state.orgUnitLevel: ", this.state.orgUnitLevel);		

		return (
      <div>
          <Card style={styleProps.styles.cardOrgUnitTree}>
              <CardText style={styleProps.styles.cardText}>
                  <h3 style={styleProps.styles.cardHeader}>Select Organization Unit</h3>
                  {d2OrgUnit}
              	{customOrgUnit}	

              	{customTree}

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
