import { message } from 'antd'
import axios from 'axios';

import * as fakeData from './fakeData'
import { graphol } from './ACIOpenData'
import { mp as MastroProperties } from './MastroProperties';


// const ips = ['192.168.0.59', '192.168.0.15']
// var mastroUrl = 'http://' + ips[0] + ':8080/mws/rest/mwsx'
// mastroUrl = '/mws/rest/mwsx'

const fakeCalls = false

export function manageError(err) {
    if (err.response === undefined) {
        reportError(err.message);
        if (err.message === 'Network Error') {
            localStorage.removeItem('headers')
            let lo = document.getElementById("logout")
            lo && lo.click()
        }
    }
    else {
        reportError(err.response.data);
        if (err.response.status === 401) { 
            localStorage.removeItem('headers')
            let lo = document.getElementById("logout")
            lo && lo.click()
        }
    }
    console.error(err)
}

function reportError(error) {
    console.error(error)
    const trace = error.stackTrace ? 'Exception in ' + error.stackTrace[0].methodName + ' ' + error.stackTrace[0].className : null
    message.error(error.message ||
        trace ||
        error)
}

export function login(username, password, mastroUrl, callback) {
    if (fakeCalls) {
        try { fakeData.fakeLogin(username, password, callback) }
        catch (err) {
            reportError(err.message)
        }
        return
    }
    if (mastroUrl === 'localhost') mastroUrl = 'http://localhost:8080/mws/rest/mwsx'
    const url = mastroUrl + '/login'
    const method = 'GET'
    const h = {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Basic ' + btoa(username + ':' + password)
    }
    axios({
        url: url,
        method: method,
        headers: h,
    }).then(function (response) {
        switch (response.status) {
            case 200:
                localStorage.setItem('headers',
                    JSON.stringify({
                        'Access-Control-Allow-Origin': '*',
                        'x-monolith-session-id': response.headers['x-monolith-session-id']
                    }))
                localStorage.setItem('username', username)
                localStorage.setItem('mastroUrl', mastroUrl)
                callback(response.data)
                break;
            case 401:
                reportError('Wrong username or password')
                callback(false)
                break;
            default:
                reportError('Error');
        }


    }).catch(function (err) {
        if (err.response === undefined) {
            reportError(err.response === undefined ? err.message : err.response.data);
            callback(false)
        }
        else switch (err.response.status) {
            case 401:
                reportError('Wrong username or password')
                callback(false)
                break;
            default:
                manageError(err)
                callback(false)
        }

    });
}

export function getOntologies(callback) {
    if (fakeCalls) return callback(fakeData.fakeDataGO);
    const url = localStorage.getItem('mastroUrl') + '/owlOntology'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postOntology(ontology, callback) {
    if (fakeCalls) return callback();
    const url = localStorage.getItem('mastroUrl') + '/owlOntology'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        data: ontology,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteOntology(ontologyID, callback) {
    if (fakeCalls) return callback();
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + ontologyID
    const method = 'DELETE'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback()
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteOntologyVersion(ontologyID, version, callback) {
    if (fakeCalls) return callback();
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + ontologyID + '/version'
    const method = 'DELETE'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers'))
    }).then(function (response) {
        callback()
    }).catch(function (err) {
        manageError(err)
    });
}

export function uploadOntologyFile(file, ontologyID, callback) {
    if (fakeCalls) return callback(true);
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + ontologyID
    const method = 'POST'
    axios({
        url: url,
        method: method,
        data: file,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(true)
    }).catch(function (err) {
        callback(false)
        manageError(err)
    });
}

export function downloadOntologyFile(name, version, callback) {
    if (fakeCalls) { console.log(name, version, callback); return }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data, name + '.owl')
    }).catch(function (err) {
        callback(false)
        manageError(err)
    });
}

export function getOntologyVersionInfo(name, version, callback) {
    if (fakeCalls) return callback(fakeData.fakeDataOI);
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/info'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getOntologyVersionHierarchy(name, version, callback) {
    if (fakeCalls) return callback(fakeData.mastroData)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/hierarchy'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getGraphol(name, version, callback) {
    if (fakeCalls) return callback(graphol)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/graphol'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data, name + '.graphol')
    }).catch(function (err) {
        manageError(err)
    });
}

export function getEntity(name, version, entityID, callback) {
    if (fakeCalls) return callback(fakeData.mappings)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/entity/' + entityID
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getClassPage(name, version, classID, callback) {
    if (fakeCalls) return callback(fakeData.classData)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/alphabet/class/' + classID + '/logical'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getObjectPropertyPage(name, version, objectPropertyID, callback) {
    if (fakeCalls) return callback({})
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/alphabet/objectProperty/' + objectPropertyID + '/logical'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getDataPropertyPage(name, version, dataPropertyID, callback) {
    if (fakeCalls) return callback({})
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/alphabet/dataProperty/' + dataPropertyID + '/logical'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getMappings(name, version, callback) {
    if (fakeCalls) return callback(fakeData.mappings)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postMapping(name, version, mapping, callback) {
    if (fakeCalls) return callback(fakeData.mappings)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, create: btoa(JSON.stringify(mapping)) },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function uploadMappingFile(name, version, file, callback) {
    if (fakeCalls) return callback(true);
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, check: true },
        data: file,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        if (response.data.success)
            callback(response.data)
        else {
            callback(false)
            message.error('Invalid mapping file: it may be malformed or not compliant with the ontology.')
            console.error(response.data)
        }
    }).catch(function (err) {
        callback(false)
        manageError(err)
    });
}

export function downloadMappingFile(name, version, mapping, callback) {
    if (fakeCalls) { console.log(name, version, mapping, callback); return }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteMappingFile(name, version, mapping, callback) {
    if (fakeCalls) return callback();
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping
    const method = 'DELETE'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getMappingInfo(name, version, mapping, callback) {
    if (fakeCalls) return callback(fakeData.mappingInfo)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/info'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getMappingAssertion(name, version, mapping, entityID, callback) {
    if (fakeCalls) return callback(fakeData.assertions)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/assertions/' + entityID
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function putMappingAssertion(name, version, mapping, mapID, assertion, callback) {
    if (fakeCalls) return callback(fakeData.assertions)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/assertion/' + mapID
    const method = 'PUT'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: assertion,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteMappingAssertion(name, version, mapping, mapID, callback) {
    if (fakeCalls) return callback(fakeData.assertions)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/assertion/' + mapID
    const method = 'DELETE'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postMappingAssertion(name, version, mapping, assertion, callback) {
    if (fakeCalls) return callback(fakeData.assertions)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/assertions'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: assertion,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getMappingViews(name, version, mapping, callback) {
    if (fakeCalls) return callback(fakeData.sqlViews)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/views'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.sqlViews)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postMappingViews(name, version, mapping, view, callback) {
    if (fakeCalls) return callback(fakeData.sqlViews)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/views'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: view,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.sqlViews)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getMappingView(name, version, mapping, viewID, callback) {
    if (fakeCalls) return callback(fakeData.sqlView)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/views/' + viewID
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function putMappingView(name, version, mapping, viewID, sqlView, callback) {
    if (fakeCalls) return callback(fakeData.sqlView)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/view/' + viewID
    const method = 'PUT'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: sqlView,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteMappingView(name, version, mapping, viewID, callback) {
    if (fakeCalls) return callback(fakeData.sqlView)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/view/' + viewID
    const method = 'DELETE'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getQueryCatalog(name, version, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/querycatalog'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.queryCatalog || [])
    }).catch(function (err) {
        manageError(err)
    });
}

export function downloadQueryCatalog(name, version, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/querycatalog/export'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function uploadQueryCatalog(name, version, file, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/querycatalog/import'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, additive: true },
        data: file,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postInQueryCatalog(name, version, query, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/query'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: query,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback()
        if (response.data === 1)
            throw ErrorEvent()
    }).catch(function (err) {
        manageError(err)
    });
}

export function putInQueryCatalog(name, version, query, callback, callbackError) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/query/' + query.queryID
    const method = 'PUT'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: query,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback()
        if (response.data === 1)
            throw ErrorEvent()
    }).catch(function (err) {
        callbackError()
        // manageError(err)
    });
}

export function deleteFromQueryCatalog(name, version, queryID, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/query/' + queryID
    const method = 'DELETE'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback()
        if (response.data === 1)
            throw ErrorEvent()
    }).catch(function (err) {
        manageError(err)
    });
}

export function startMastro(name, version, mapping, callback) {
    if (fakeCalls) return callback()
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/instance'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        data: MastroProperties,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback()
        if (response.data === 1)
            throw ErrorEvent()
    }).catch(function (err) {
        manageError(err)
    });
}

export function stopMastro(name, version, mapping, callback) {
    if (fakeCalls) return callback()
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/instance'
    const method = 'DELETE'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(mapping)
        if (response.data === 1)
            throw ErrorEvent()
    }).catch(function (err) {
        manageError(err)
    });
}


export function getMastroStatus(name, version, mapping, callback) {
    if (fakeCalls) { return callback(fakeData.status(), mapping) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/instance'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data, mapping)
    }).catch(function (err) {
        manageError(err)
    });
}

export function startNewQuery(name, version, mapping, query, reasoning, callback) {
    if (fakeCalls) return callback('pippoQuery')
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/start'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, reasoning: reasoning },
        data: query,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.executionId)
    }).catch(function (err) {
        manageError(err)
    });
}

export function startNewConstructQuery(name, version, mapping, query, reasoning, callback) {
    if (fakeCalls) return callback('pippoQuery')
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/cquery/start'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, reasoning: reasoning },
        data: query,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.executionId)
    }).catch(function (err) {
        manageError(err)
    });
}

export function startQuery(name, version, mapping, queryID, reasoning, callback) {
    if (fakeCalls) return callback('pippoQuery')
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + queryID + '/start'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, reasoning: reasoning },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.executionId)
    }).catch(function (err) {
        manageError(err)
    });
}

export function startConstructQuery(name, version, mapping, queryID, reasoning, callback) {
    if (fakeCalls) return callback('pippoQuery')
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/cquery/' + queryID + '/start'
    const method = 'POST'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, reasoning: reasoning },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.executionId)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getQueryStatus(name, version, mapping, queryID, callback, errorCall) {
    if (fakeCalls) { return callback(fakeData.queryStatus()) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + queryID + '/status'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
        errorCall(err)
    });
}

export function getConstructQueryStatus(name, version, mapping, queryID, callback, errorCall) {
    if (fakeCalls) { return callback(fakeData.queryStatus()) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/cquery/' + queryID + '/status'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
        errorCall()
    });
}

export function getQueryResults(name, version, mapping, executionID, page, pageSize, callback, errorCall) {
    if (fakeCalls) { return fakeData.queryResults(callback) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + executionID + '/results'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, pagesize: pageSize, pagenumber: page },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
        errorCall()
    });
}

export function getConstructQueryResults(name, version, mapping, executionID, page, pageSize, callback, errorCall) {
    if (fakeCalls) { return fakeData.queryResults(callback) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/cquery/' + executionID + '/results'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, pagesize: pageSize, pagenumber: page },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
        errorCall()
    });
}

export function getOntologyRewritings(name, version, mapping, executionID, page, pageSize, callback) {
    if (fakeCalls) { return callback(fakeData.ontoRews) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + executionID + '/ontologyRewritings'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, pagesize: pageSize, pagenumber: page },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.ontologyRewritings)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getMappingRewritings(name, version, mapping, executionID, page, pageSize, callback) {
    if (fakeCalls) { return callback(fakeData.mapRews) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + executionID + '/mappingRewritings'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, pagesize: pageSize, pagenumber: page },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.mappingRewritings)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getViewRewritings(name, version, mapping, executionID, page, pageSize, callback) {
    if (fakeCalls) { return callback(fakeData.viewRews) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + executionID + '/viewRewritings'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion, pagesize: pageSize, pagenumber: page },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.viewRewritings)
    }).catch(function (err) {
        manageError(err)
    });
}

export function downloadQueryResults(name, version, mapping, executionID, callback) {
    if (fakeCalls) { return fakeData.queryResults(callback) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/query/' + executionID + '/exportFile'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function downloadConstructQueryResults(name, version, mapping, executionID, callback) {
    if (fakeCalls) { return fakeData.queryResults(callback) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/cquery/' + executionID + '/export'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getPrefixes(name, version, mapping, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/owlOntology/' + name + '/version/mapping/' + mapping + '/prefixes'
    const method = 'GET'
    const encodedVersion = version//encodeURIComponent(version)
    axios({
        url: url,
        method: method,
        params: { version: encodedVersion },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data, mapping)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getDatasources(callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/datasource'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postDatasources(datasource, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/datasource'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        data: datasource,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function putDatasources(datasourceID, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/datasource/' + datasourceID
    const method = 'PUT'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteDatasources(datasourceID, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/datasource/' + datasourceID
    const method = 'DELETE'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getDatasourceDrivers(callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/datasource/drivers'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getLastLoadedOntologies(callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/lastLoaded/ontology'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getLastLoadedKnowledgeGraphs(callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/lastLoaded/knowledgeGraph'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}
