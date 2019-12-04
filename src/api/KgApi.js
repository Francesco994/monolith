import {manageError} from './MastroApi'
import axios from 'axios';

import * as fakeData from './fakeData'

const fakeCalls = false


export function getKnowledgeGraphs(callback) {
    if (fakeCalls) return callback(fakeData.kgs)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraphs'
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

export function postKnowledgeGraph(kg, callback) {
    if (fakeCalls) return callback(fakeData.kgs)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraphs'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        data: kg,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteKnowledgeGraph(kgIri, callback) {
    if (fakeCalls) return callback(fakeData.kgs)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph'
    const method = 'DELETE'
    axios({
        url: url,
        method: method,
        data: kgIri,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getKnowledgeGraphInfo(kgIri, callback) {
    if (fakeCalls) return callback(fakeData.kgs[0])
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        params: { iri: kgIri }
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function putKnowledgeGraphFile(kgFile, callback) {
    if (fakeCalls) return callback(fakeData.kgs[0])
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/file'
    const method = 'PUT'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        data: kgFile
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function downloadKnowledgeGraph(kgIri, format, callback) {
    if (fakeCalls) return
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/file'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        params: { iri: kgIri, format: format }
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function patchKnowledgeGraphUnion(kgUnion, callback) {
    if (fakeCalls) return callback(fakeData.kgs[0])
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/union'
    const method = 'PATCH'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        data: kgUnion
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function patchKnowledgeGraphUnionOntology(kgOntologyUnion, callback) {
    if (fakeCalls) return callback(fakeData.kgs[0])
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/union/ontology'
    const method = 'PATCH'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        data: kgOntologyUnion
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function patchKnowledgeGraphUnionQueryOBDA(kgOBDAQueryUnion, callback) {
    if (fakeCalls) return callback(fakeData.kgs[0])
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/union/queryOBDA'
    const method = 'PUT'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        data: kgOBDAQueryUnion,
        params: { uploadOnly: true }
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function patchKnowledgeGraphUnionQueryKg(kgQueryUnion, callback) {
    if (fakeCalls) return callback(fakeData.kgs[0])
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/union/queryKg'
    const method = 'PATCH'
    axios({
        url: url,
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
        data: kgQueryUnion
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getQueryCatalogKg(kgIri, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.queryCatalog)
    }).catch(function (err) {
        manageError(err)
    });
}

export function downloadQueryCatalogKg(kgIri, callback) {
    if (fakeCalls) return
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog/export'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function uploadQueryCatalogKg(kgIri, file, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog/import'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri, additive: true },
        data: file,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postInQueryCatalog(kgIri, query, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
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

export function putInQueryCatalog(kgIri, query, callback, callbackError) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog/' + query.queryID
    const method = 'PUT'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
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

export function deleteFromQueryCatalogKg(kgIri, queryID, callback) {
    if (fakeCalls) return callback(fakeData.queryCatalog)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog/' + queryID
    const method = 'DELETE'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback()
        if (response.data === 1)
            throw ErrorEvent()
    }).catch(function (err) {
        manageError(err)
    });
}

export function startNewQuery(kgIri, query, callback) {
    if (fakeCalls) return callback('pippoQuery')
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/start'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        data: query,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.queryID)
    }).catch(function (err) {
        manageError(err)
    });
}

export function startQuery(kgIri, queryID, callback) {
    if (fakeCalls) return callback('pippoQuery')
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/catalog/' + queryID + '/start'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data.queryID)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getQueryStatus(kgIri, queryID, callback, errorCall) {
    if (fakeCalls) { return callback(fakeData.queryStatus()) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/' + queryID + '/status'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
        errorCall()
    });
}

export function getQueryResults(kgIri, executionID, page, pageSize, callback, errorCall) {
    if (fakeCalls) { return fakeData.queryResults(callback) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/' + executionID + '/results'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri, offset: page * pageSize, pagesize: pageSize },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
        errorCall()
    });
}

export function downloadQueryResults(kgIri, executionID, callback) {
    if (fakeCalls) { return fakeData.queryResults(callback) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/query/' + executionID + '/exportFile'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getPrefixes(kgIri, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/prefixes'
    const method = 'GET'
    axios({
        url: url,
        params: { iri: kgIri },
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getClasses(kgIri, namedGraph, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/classes'
    const method = 'GET'
    axios({
        url: url,
        params: { iri: kgIri, namedGraph: namedGraph },
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getInstances(kgIri, classIri, namedGraph, callback) {
    if (fakeCalls) { return callback([]) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/class/instances'
    const method = 'GET'
    axios({
        url: url,
        params: { kgIri: kgIri, classIri: classIri, namedGraph: namedGraph },
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getInstancePage(kgIri, iri, callback) {
    if (fakeCalls) return callback(fakeData.instancePage)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/instance/page'
    const method = 'GET'
    axios({
        url: url,
        params: { instanceIri: iri, kgIri: kgIri, namedGraph: null },
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getSubjectType(kgIri, subject, predicate, type, page, callback) {
    if (fakeCalls) return callback(fakeData.getSubjectPredicatePageType)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/instance/subjectType'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { kgIri, subject, predicate, type, page, namedGraph: null },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getObjectType(kgIri, object, predicate, type, page, callback) {
    if (fakeCalls) return callback(fakeData.getObjectPredicatePageType)
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/instance/objectType'
    const method = 'GET'
    axios({
        url: url,
        params: { kgIri, object, predicate, type, page, namedGraph: null },
        method: method,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getKnowledgeGraphFiles(kgIri, callback) {
    if (fakeCalls) { return callback(fakeData.kgFiles) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/upload/files'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function postKnowledgeGraphFile(kgIri, fileInfo, callback) {
    if (fakeCalls) { return callback(fakeData.kgFiles) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/upload/file'
    const method = 'POST'
    axios({
        url: url,
        method: method,
        data: fileInfo,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function deleteKnowledgeGraphFile(kgIri, files, callback) {
    if (fakeCalls) { return callback(fakeData.kgFiles) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/delete/file'
    const method = 'DELETE'
    axios({
        url: url,
        method: method,
        data: files,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}



export function putUploadedKnowledgeGraphFile(kgFileDestination, callback) {
    if (fakeCalls) { return callback(fakeData.kgFiles) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/upload/import'
    const method = 'PUT'
    axios({
        url: url,
        method: method,
        data: kgFileDestination,
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}


export function getKnowledgeGraphStatus(kgIri, callback) {
    if (fakeCalls) { return callback(fakeData.kgFiles) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/status'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}

export function getKnowledgeGraphNamedGraphs(kgIri, callback) {
    if (fakeCalls) { return callback(fakeData.kgFiles) }
    const url = localStorage.getItem('mastroUrl') + '/knowledgeGraph/namedGraphs'
    const method = 'GET'
    axios({
        url: url,
        method: method,
        params: { iri: kgIri },
        headers: JSON.parse(localStorage.getItem('headers')),
    }).then(function (response) {
        callback(response.data)
    }).catch(function (err) {
        manageError(err)
    });
}