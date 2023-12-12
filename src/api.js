// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = 'http://ec2con-ecsel-ej6j7slnqvxx-1891721232.us-east-1.elb.amazonaws.com:8080';
//const apiUrl = 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
async function streamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  let result = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    result += decoder.decode(value);
  }

  return result; 
}

export async function getById(user, id){
  console.log("in get by id, id: " + id);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: user.authorizationHeaders(),
    });
    const data = await streamToString(res.body);
    console.log(data);
    //document.getElementById('dataHere') = data;
    var text = document.getElementById('dataHere');
    text.innerText = data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function delById(user, id){
  console.log("in del by id, id: " + id);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      headers: user.authorizationHeaders(),
    });
    if(res.ok){
      const data = await res.json();
      console.log("Fragment deleted successfully", { data });
      document.getElementById("msgHere").innerText = `Fragment ${id} deleted`;
    } else {
      console.error("Error:", res.statusText)
      document.getElementById("msgHere").innerText = `Fragment ${id} not found`;
    } 
    
  } catch (err){{
    console.error(`Unable to Delete /v1/fragment/${id}`, { err });
  }}
}

export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function displayFragments(user){
  try{
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
 
    const body = document.getElementById('tb')

    data.fragments.forEach(frag => {
      const tr = document.createElement('tr');
      
      const td1 = document.createElement('td');
      const td3 = document.createElement('td');
      const td4 = document.createElement('td');
      const td5 = document.createElement('td');
      const td6 = document.createElement('td');

      td1.innerText = frag.id;
      td3.innerText = frag.created;
      td4.innerText = frag.updated;
      td5.innerText = frag.type;
      td6.innerText = frag.size;

      tr.appendChild(td1);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);

      body.appendChild(tr);
    })
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

//put request
export async function putUserFragments(user, id, data, cont){
  console.log(`editing fragment`);

  try {
    var auth = user.authorizationHeaders();
    var headers = Object.assign(
      auth,
      {"Content-Type": cont}
  );
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`,{
      method: "PUT",
      headers: headers,
      body: data
    })
    if(res.ok){
      const data = await res.json();
      console.log("Fragment updated successfully", {data});
      document.getElementById("msgPutHere").innerText = `Fragment ${id} updated`;
    } else {
      console.log("Error:", res.statusText)
      document.getElementById("msgPutHere").innerText = `Error updating Fragment ${id}`;
    }
  } catch (error) {
    console.log("Error:", error)
    document.getElementById("msgPutHere").innerText = `Error updating Fragment ${id}`;
  }
}

//make a post request
export async function postUserFragments(user, data){
  console.log('Sending it to API');
  var e = document.getElementById("content-type");

  try {
    var auth = user.authorizationHeaders();
    var headers = Object.assign(
      auth,
      {"Content-Type": e.value}
  );
    const res = await fetch(`${apiUrl}/v1/fragments`,{
      method: "POST",
      headers: headers,
      body: data
    })
    if(res.ok){
      const data = await res.json();
      console.log("Fragment created successfully", { data });
    } else {
      console.error("Error:", res.statusText)
    }
  } catch (error) {
    console.log("Error:", error);
  }
}