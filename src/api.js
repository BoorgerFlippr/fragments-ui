// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
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
    
    const div = document.getElementById('textHere');
    div.innerHTML = '';

    data.fragments.forEach(frag => {
      const p = document.createElement('p');
      p.textContent = JSON.stringify(frag, null, 2);
      div.appendChild(p);
    })
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
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