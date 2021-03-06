import React from 'react';
import { NavLink } from 'react-router-dom'
import { renderEntity, predicateTypes } from '../../utils/utils'

export default class Entity extends React.Component {
    render() {
        let predicateType = this.props.predicateType
        if (predicateType === undefined) {
            switch(this.props.entity.entityType) {
                case 'CLASS':
                    predicateType = predicateTypes.c
                    break;
                case 'OBJECT_PROPERTY':
                    predicateType = predicateTypes.op
                    break;
                case 'DATA_PROPERTY':
                        predicateType = predicateTypes.dp
                        break;
                default: 
                    predicateType = this.props.entity.entityType
            }

        }
        return (
            this.props.entity.entityType === 'EXPRESSION' ?
                this.props.entity.entityID :
                // REMOVE THIS LINE WHEN INDIVIDUAL PAGE IS READY
                predicateType === 'individuals' ? <div>{renderEntity(this.props.entity)} </div> :
                    <NavLink
                        to={"/open/ontology/wiki/" + predicateType + "/" + this.props.entity.entityID}>
                        {renderEntity(this.props.entity)}
                    </NavLink>
        )
    }
}
