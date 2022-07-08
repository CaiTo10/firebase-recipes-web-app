import firebase from "./FirebaseConfig";

const firestore = firebase.firestore()

const createDocument = (collection,document)=>{
    return firestore.collection(collection).add(document)
}
const readDocument = async (collection, id)=>{
    return firestore.collection(collection).doc(id).get()
}
const readDocuments = async ({collection,queries,orderByField , orderByDirection, perPage,cursorId})=>{
    let collectionRef = firestore.collection(collection) 
    if(queries && queries.length >0){
        for(const query of queries){
            // console.log(query)
            // this is same as set state(prev=>prev+new where(queries))
            collectionRef = collectionRef.where(
                query.field,query.condition,query.value
            )
        }
    }
    if(orderByField && orderByDirection){
        collectionRef = collectionRef.orderBy(orderByField,orderByDirection)
    }
    if(perPage){
        collectionRef = collectionRef.limit(perPage)
    }
    // the id of docs we want to start from
    if(cursorId){
        const document = await readDocument(collection,cursorId)
        collectionRef = collectionRef.startAfter(document)
    }
    return collectionRef.get()
}

const updateDocument = (collection,id,document) =>{
    return firestore.collection(collection).doc(id).update(document)
}

const deleteDocument =(collection,id)=>{
    return firestore.collection(collection).doc(id).delete()
}
const FirebaseFirestoreService = {
    createDocument,
    readDocuments,
    updateDocument,
    deleteDocument
}

export default FirebaseFirestoreService