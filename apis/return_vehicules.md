1.POST interventions/create_vehicule_return
FormData 

Case 1 create first vehicule return with image 

body :

```js
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("initial_material_id", this.currentVehicule[0]);
    uploadData.append("is_changed", this.confimState == true ? "false" : "true");
    uploadData.append("date", new Date() + "");
    if (this.confimState == true) uploadData.append("material_id", this.currentVehicule[0]);
    else uploadData.append("material_id", this.pickedVehicule[0]);

    if (this.planningType == "forfaitaire") {
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
    }
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (!this.data.teamMember.vehicule_returns) uploadData.append("return_type", "first");

   const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photosService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    uploadData.append("photo", blob, fileName);
    uploadData.append("photo_type", "return_vehicule");

```

success response : 

```json
[
    {
        "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/1760540236997.jpeg",
        "thumb": {
            "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/thumb_1760540236997.jpeg"
        },
        "return_id": 504
    },
    {
        "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/1760540306422.jpeg",
        "thumb": {
            "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/thumb_1760540306422.jpeg"
        },
        "return_id": 504
    }
]
```

Case 2 create first vehicule return with voice

body :

```js
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("initial_material_id", this.currentVehicule[0]);
    uploadData.append("is_changed", this.confimState == true ? "false" : "true");
    uploadData.append("date", new Date() + "");
    if (this.confimState == true) uploadData.append("material_id", this.currentVehicule[0]);
    else uploadData.append("material_id", this.pickedVehicule[0]);

    if (this.planningType == "forfaitaire") {
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
    }
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (!this.data.teamMember.vehicule_returns) uploadData.append("return_type", "first");
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }

```
success response

```json
{
    "user_id": 6,
    "date": "2025-10-15",
    "initial_material_id": 4,
    "return_raison": "first",
    "hour_start": "08:00",
    "hour_end": "17:00",
    "is_changed": false,
    "material_id": 4,
    "id": 504,
    "planning_punctual_id": 2639,
    "forfaitaire_item_id": null,
    "photo": [
        {
            "type": "first",
            "file_name": "1760540236997.jpeg"
        },
        {
            "type": "first",
            "file_name": "1760540306422.jpeg"
        }
    ],
    "created_at": "2025-10-15T14:57:17.820Z",
    "updated_at": "2025-10-15T15:00:13.862Z",
    "broken_place_lat": null,
    "broken_place_long": null,
    "file": [
        {
            "type": "first",
            "file_name": "1760540413265.wav"
        }
    ],
    "address": null
}
```


2.POST /create_not_adapted_vehicule_return
Forma Data

Case 1 Create not adapted vehicule return with image


body:

```js
uploadData.append("user_id", this.data.teamMember.id);
    if (this.materials?.initial) {
      uploadData.append("initial_material_id", this.materials.initial);
      uploadData.append("material_id", this.materials.final);
    } else {
      uploadData.append("initial_material_id", this.currentVehicule[0]);
      uploadData.append("material_id", this.pickedVehicule[0]);
    }
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "true");
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1]
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "not_adapted");
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }
     const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photosService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    uploadData.append("photo", blob, fileName);
    uploadData.append("photo_type", "return_vehicule");
```
success response 
```json
{
    "mobile_photos": [
        {
            "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/1760540980277.jpeg",
            "thumb": {
                "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/thumb_1760540980277.jpeg"
            },
            "return_id": 505,
            "material_id": 2,
            "initial_material_id": 4
        }
    ],
    "mission_return_vehicule": {
        "id": 505,
        "planning_punctual_id": 2639,
        "forfaitaire_item_id": null,
        "user_id": 6,
        "photo": [
            {
                "type": "not_adapted",
                "file_name": "1760540980277.jpeg"
            }
        ],
        "date": "2025-10-15",
        "material_id": 2,
        "created_at": "2025-10-15T15:09:40.985Z",
        "updated_at": "2025-10-15T15:09:40.985Z",
        "initial_material_id": 4,
        "is_changed": true,
        "return_raison": "not_adapted",
        "hour_start": "17:09:40",
        "hour_end": "17:00",
        "broken_place_lat": null,
        "broken_place_long": null,
        "file": [],
        "address": null
    },
    "vehicule": {
        "id": 2,
        "name": "CAMION-FG-891-QB",
        "type_material": "vehicule",
        "photo": {
            "url": "https://ideo.webo.tn/assets/img/default-user.png",
            "thumb": {
                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
            }
        },
        "notes": "/2024-12-12: Has issue|return_id:55 | return_raison:has_issue/2024-12-12: Panne|return_id:55 | return_raison:not_functional/2025-05-22: azerty|return_id:380 | return_raison:not_functional/2025-05-22: zer|return_id:393 | return_raison:not_functional/2025-05-22: vvv|return_id:401 | return_raison:has_issue/2025-05-22: hjh|return_id:401 | return_raison:has_issue/2025-05-22: zezezeze|return_id:401 | return_raison:not_functional/2025-05-22: zaeaez|return_id:420 | return_raison:not_functional/2025-05-22: sdqsdq|return_id:421 | return_raison:not_functional/2025-05-22: qsdqsd|return_id:424 | return_raison:has_issue/2025-05-22: qsdqsdqsdqds|return_id:424 | return_raison:not_functional",
        "serial_number": null,
        "driver_id": 3,
        "grey_card": {
            "url": "https://apideo.webo.tn/uploads/material/grey_card/2/Scan_0007(2).jpg"
        },
        "insurance": {
            "url": "https://apideo.webo.tn/uploads/material/insurance/2/FG-891-QB(2).pdf"
        },
        "active": true,
        "created_at": "2024-03-25T12:23:06.081Z",
        "updated_at": "2025-05-22T14:59:45.135Z",
        "uniq": false,
        "address_recup": null,
        "lat": 48.9137322,
        "long": 2.3771928,
        "confirm_required": true
    }
}
```
Case 2 Create not adapted return with voice
body :

```js
    uploadData.append("user_id", this.data.teamMember.id);
    if (this.materials?.initial) {
      uploadData.append("initial_material_id", this.materials.initial);
      uploadData.append("material_id", this.materials.final);
    } else {
      uploadData.append("initial_material_id", this.currentVehicule[0]);
      uploadData.append("material_id", this.pickedVehicule[0]);
    }
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "true");
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1]
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "not_adapted");
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }
  if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
```

success response 
```json
{
    "user_id": 6,
    "date": "2025-10-15",
    "initial_material_id": 4,
    "material_id": 2,
    "planning_punctual_id": 2639,
    "is_changed": true,
    "hour_start": "17:12:31",
    "hour_end": "17:00",
    "id": 505,
    "forfaitaire_item_id": null,
    "photo": [
        {
            "type": "not_adapted",
            "file_name": "1760540980277.jpeg"
        }
    ],
    "created_at": "2025-10-15T15:09:40.985Z",
    "updated_at": "2025-10-15T15:12:32.430Z",
    "return_raison": "not_adapted",
    "broken_place_lat": null,
    "broken_place_long": null,
    "file": [
        {
            "type": "not_adapted",
            "file_name": "1760541151807.wav"
        }
    ],
    "address": null,
    "vehicule": {
        "id": 2,
        "name": "CAMION-FG-891-QB",
        "type_material": "vehicule",
        "photo": {
            "url": "https://ideo.webo.tn/assets/img/default-user.png",
            "thumb": {
                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
            }
        },
        "notes": "/2024-12-12: Has issue|return_id:55 | return_raison:has_issue/2024-12-12: Panne|return_id:55 | return_raison:not_functional/2025-05-22: azerty|return_id:380 | return_raison:not_functional/2025-05-22: zer|return_id:393 | return_raison:not_functional/2025-05-22: vvv|return_id:401 | return_raison:has_issue/2025-05-22: hjh|return_id:401 | return_raison:has_issue/2025-05-22: zezezeze|return_id:401 | return_raison:not_functional/2025-05-22: zaeaez|return_id:420 | return_raison:not_functional/2025-05-22: sdqsdq|return_id:421 | return_raison:not_functional/2025-05-22: qsdqsd|return_id:424 | return_raison:has_issue/2025-05-22: qsdqsdqsdqds|return_id:424 | return_raison:not_functional",
        "serial_number": null,
        "driver_id": 3,
        "grey_card": {
            "url": "https://apideo.webo.tn/uploads/material/grey_card/2/Scan_0007(2).jpg"
        },
        "insurance": {
            "url": "https://apideo.webo.tn/uploads/material/insurance/2/FG-891-QB(2).pdf"
        },
        "active": true,
        "created_at": "2024-03-25T12:23:06.081Z",
        "updated_at": "2025-05-22T14:59:45.135Z",
        "uniq": false,
        "address_recup": null,
        "lat": 48.9137322,
        "long": 2.3771928,
        "confirm_required": true
    }
}
```


3.POST interventions/create_has_issue_vehicule_return
FormData

Case 1 with photo

body : 
```js
  uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.data.teamMember.vehicule.id);
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "false");
    uploadData.append("date", new Date() + "");
    uploadData.append("note", this.note);
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1]
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "has_issue");
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }

    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photosService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    uploadData.append("photo", blob, fileName);
    uploadData.append("photo_type", "return_vehicule");
```

succes respons : 
```json
{
    "mobile_photos": [
        {
            "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/1760542069108.jpeg",
            "thumb": {
                "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/thumb_1760542069108.jpeg"
            },
            "return_id": 505,
            "material_id": 2,
            "initial_material_id": 4
        }
    ],
    "mission_return_vehicule": {
        "id": 505,
        "planning_punctual_id": 2639,
        "forfaitaire_item_id": null,
        "user_id": 6,
        "photo": [
            {
                "type": "not_adapted",
                "file_name": "1760540980277.jpeg"
            },
            {
                "type": "has_issue",
                "file_name": "1760542069108.jpeg"
            }
        ],
        "date": "2025-10-15",
        "material_id": 2,
        "created_at": "2025-10-15T15:09:40.985Z",
        "updated_at": "2025-10-15T15:27:49.902Z",
        "initial_material_id": 4,
        "is_changed": true,
        "return_raison": "not_adapted,has_issue",
        "hour_start": "17:12:31",
        "hour_end": "17:00",
        "broken_place_lat": null,
        "broken_place_long": null,
        "file": [
            {
                "type": "not_adapted",
                "file_name": "1760541151807.wav"
            }
        ],
        "address": null
    }
}
```

Case 2 with voice or note 

body : 
```js
  uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.data.teamMember.vehicule.id);
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "false");
    uploadData.append("date", new Date() + "");
    uploadData.append("note", this.note);
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1]
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "has_issue");
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }

          if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
```

success response :
```json
{
    "id": 505,
    "planning_punctual_id": 2639,
    "forfaitaire_item_id": null,
    "user_id": 6,
    "photo": [
        {
            "type": "not_adapted",
            "file_name": "1760540980277.jpeg"
        },
        {
            "type": "has_issue",
            "file_name": "1760542069108.jpeg"
        }
    ],
    "date": "2025-10-15",
    "material_id": 2,
    "created_at": "2025-10-15T15:09:40.985Z",
    "updated_at": "2025-10-15T15:32:07.356Z",
    "initial_material_id": 4,
    "is_changed": true,
    "return_raison": "not_adapted,has_issue",
    "hour_start": "17:12:31",
    "hour_end": "17:00",
    "broken_place_lat": null,
    "broken_place_long": null,
    "file": [
        {
            "type": "not_adapted",
            "file_name": "1760541151807.wav"
        },
        {
            "type": "has_issue",
            "file_name": "1760542326775.wav"
        }
    ],
    "address": null
}
```

4. POST /create_not_function_vehicule_return
FormData 
Case 1 with photo 
body:
```js
    const uploadData = new FormData();
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.data.teamMember.vehicule.id);
    uploadData.append("userLat", this.currentLocation.latitude.toString());
    uploadData.append("userLong", this.currentLocation.longitude.toString());
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "false");
    uploadData.append("date", new Date() + "");
    uploadData.append("note", this.note);
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1] + ""
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "not_functional");
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);

    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }
    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photosService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    uploadData.append("photo", blob, fileName);
    uploadData.append("photo_type", "return_vehicule");
```
success response :

```json
{
    "mobile_photos": [
        {
            "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/1760542428839.jpeg",
            "thumb": {
                "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/thumb_1760542428839.jpeg"
            },
            "return_id": 505,
            "material_id": 2,
            "initial_material_id": 4
        }
    ],
    "mission_return_vehicule": {
        "broken_place_lat": "36.93779372991263",
        "broken_place_long": "10.040519710084318",
        "return_raison": "not_adapted,has_issue,not_functional",
        "id": 505,
        "planning_punctual_id": 2639,
        "forfaitaire_item_id": null,
        "user_id": 6,
        "photo": [
            {
                "type": "not_adapted",
                "file_name": "1760540980277.jpeg"
            },
            {
                "type": "has_issue",
                "file_name": "1760542069108.jpeg"
            },
            {
                "type": "not_functional",
                "file_name": "1760542428839.jpeg"
            }
        ],
        "date": "2025-10-15",
        "material_id": 2,
        "created_at": "2025-10-15T15:09:40.985Z",
        "updated_at": "2025-10-15T15:33:49.619Z",
        "initial_material_id": 4,
        "is_changed": true,
        "hour_start": "17:12:31",
        "hour_end": "17:33:48",
        "file": [
            {
                "type": "not_adapted",
                "file_name": "1760541151807.wav"
            },
            {
                "type": "has_issue",
                "file_name": "1760542326775.wav"
            }
        ],
        "address": null
    }
}
```
Case 2 with voice or note

```js
    const uploadData = new FormData();
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.data.teamMember.vehicule.id);
    uploadData.append("userLat", this.currentLocation.latitude.toString());
    uploadData.append("userLong", this.currentLocation.longitude.toString());
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "false");
    uploadData.append("date", new Date() + "");
    uploadData.append("note", this.note);
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1] + ""
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "not_functional");
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);

    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }
        if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
```
success response = 
```json
{
    "broken_place_lat": "36.93779372991263",
    "broken_place_long": "10.040519710084318",
    "hour_end": "17:37:44",
    "id": 505,
    "planning_punctual_id": 2639,
    "forfaitaire_item_id": null,
    "user_id": 6,
    "photo": [
        {
            "type": "not_adapted",
            "file_name": "1760540980277.jpeg"
        },
        {
            "type": "has_issue",
            "file_name": "1760542069108.jpeg"
        },
        {
            "type": "not_functional",
            "file_name": "1760542428839.jpeg"
        }
    ],
    "date": "2025-10-15",
    "material_id": 2,
    "created_at": "2025-10-15T15:09:40.985Z",
    "updated_at": "2025-10-15T15:37:45.350Z",
    "initial_material_id": 4,
    "is_changed": true,
    "return_raison": "not_adapted,has_issue,not_functional",
    "hour_start": "17:12:31",
    "file": [
        {
            "type": "not_adapted",
            "file_name": "1760541151807.wav"
        },
        {
            "type": "has_issue",
            "file_name": "1760542326775.wav"
        },
        {
            "type": "not_functional",
            "file_name": "1760542664747.wav"
        }
    ],
    "address": null
}
```

5.POST /interventions/agent_get_vehicule
FormData
Case 1 with photo
```js
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.pickedVehicule[0]);
    uploadData.append("initial_material_id", this.pickedVehicule[0]);
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "true");
    uploadData.append("return_type", "get_vehicule");
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1] + ""
    );
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);

    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }

        const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photosService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    uploadData.append("photo", blob, fileName);
    uploadData.append("photo_type", "return_vehicule");
```
success response :

```json
{
    "mobile_photos": [
        {
            "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/1760542756620.jpeg",
            "thumb": {
                "url": "https://apideo.webo.tn/uploads/mission_return_vehicule/photo/thumb_1760542756620.jpeg"
            },
            "return_id": 506,
            "material_id": 7,
            "initial_material_id": 7
        }
    ],
    "mission_return_vehicule": {
        "id": 506,
        "planning_punctual_id": 2639,
        "forfaitaire_item_id": null,
        "user_id": 6,
        "photo": [
            {
                "type": "get_vehicule",
                "file_name": "1760542756620.jpeg"
            }
        ],
        "date": "2025-10-15",
        "material_id": 7,
        "created_at": "2025-10-15T15:39:17.411Z",
        "updated_at": "2025-10-15T15:39:17.411Z",
        "initial_material_id": 7,
        "is_changed": false,
        "return_raison": "get_vehicule",
        "hour_start": "17:39:16",
        "hour_end": "17:00",
        "broken_place_lat": null,
        "broken_place_long": null,
        "file": [],
        "address": null
    },
    "vehicule": {
        "id": 7,
        "name": "ES-046-FS",
        "type_material": "vehicule",
        "photo": {
            "url": "https://ideo.webo.tn/assets/img/default-user.png",
            "thumb": {
                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
            }
        },
        "notes": "Au garage encore, à récupérer rapidement./2024-12-11: Defaut |return_id:47 | return_raison:has_issue/2025-01-28: panne|return_id:112 | return_raison:not_functional/2025-05-22: atyu|return_id:352 | return_raison:has_issue/2025-05-22: azerty|return_id:352 | return_raison:not_functional/2025-05-22: qazert|return_id:366 | return_raison:not_functional/2025-05-22: n|return_id:387 | return_raison:not_functional/2025-05-22: sdfsdfs|return_id:416 | return_raison:not_functional/2025-06-03: n|return_id:441 | return_raison:not_functional/2025-06-03: n|return_id:442 | return_raison:not_functional",
        "serial_number": null,
        "driver_id": 4,
        "grey_card": {
            "url": "https://apideo.webo.tn/uploads/material/grey_card/7/Scan_0015_2__2_(2).jpg"
        },
        "insurance": {
            "url": "https://apideo.webo.tn/uploads/material/insurance/7/ES-046-FS_2__2_(2).pdf"
        },
        "active": true,
        "created_at": "2024-03-25T12:28:48.262Z",
        "updated_at": "2025-06-03T09:21:12.042Z",
        "uniq": false,
        "address_recup": null,
        "lat": 48.9137322,
        "long": 2.3771928,
        "confirm_required": true
    }
}
```
Case 2 withi voice
```js
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.pickedVehicule[0]);
    uploadData.append("initial_material_id", this.pickedVehicule[0]);
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "true");
    uploadData.append("return_type", "get_vehicule");
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1] + ""
    );
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);

    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
```

success response

```json
{
    "date": "2025-10-15",
    "initial_material_id": 7,
    "hour_start": "17:43:19",
    "hour_end": "17:00",
    "id": 506,
    "planning_punctual_id": 2639,
    "forfaitaire_item_id": null,
    "user_id": 6,
    "photo": [
        {
            "type": "get_vehicule",
            "file_name": "1760542756620.jpeg"
        }
    ],
    "material_id": 7,
    "created_at": "2025-10-15T15:39:17.411Z",
    "updated_at": "2025-10-15T15:43:20.238Z",
    "is_changed": false,
    "return_raison": "get_vehicule",
    "broken_place_lat": null,
    "broken_place_long": null,
    "file": [
        {
            "type": "get_vehicule",
            "file_name": "1760542999634.wav"
        }
    ],
    "address": null,
    "vehicule": {
        "id": 7,
        "name": "ES-046-FS",
        "type_material": "vehicule",
        "photo": {
            "url": "https://ideo.webo.tn/assets/img/default-user.png",
            "thumb": {
                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
            }
        },
        "notes": "Au garage encore, à récupérer rapidement./2024-12-11: Defaut |return_id:47 | return_raison:has_issue/2025-01-28: panne|return_id:112 | return_raison:not_functional/2025-05-22: atyu|return_id:352 | return_raison:has_issue/2025-05-22: azerty|return_id:352 | return_raison:not_functional/2025-05-22: qazert|return_id:366 | return_raison:not_functional/2025-05-22: n|return_id:387 | return_raison:not_functional/2025-05-22: sdfsdfs|return_id:416 | return_raison:not_functional/2025-06-03: n|return_id:441 | return_raison:not_functional/2025-06-03: n|return_id:442 | return_raison:not_functional",
        "serial_number": null,
        "driver_id": 4,
        "grey_card": {
            "url": "https://apideo.webo.tn/uploads/material/grey_card/7/Scan_0015_2__2_(2).jpg"
        },
        "insurance": {
            "url": "https://apideo.webo.tn/uploads/material/insurance/7/ES-046-FS_2__2_(2).pdf"
        },
        "active": true,
        "created_at": "2024-03-25T12:28:48.262Z",
        "updated_at": "2025-06-03T09:21:12.042Z",
        "uniq": false,
        "address_recup": null,
        "lat": 48.9137322,
        "long": 2.3771928,
        "confirm_required": true
    }
}
```

7.GET '/free_vehicules/:planning_id/:user_id/:type'
success response of ==> /user/free_vehicules/5394/4/punctual

```js
// return list of free vehicules 
 //[vehicule_id,vehicule_name, driver_id]  
[
    [
        13,
        "VEHICULE AC-645-CK",
        31
    ],
    [
        10,
        "FORD",
        29
    ],
    [
        5,
        "EY-132-GS",
        63
    ],
    [
        9,
        "CAMION-CD-728-FG",
        9
    ]
]
```

8.GET /find_mission_return_vehicules/:id/:type 

success reposnse of /find_mission_return_vehicules/2641/punctual

```json
[
    {
        "id": 509,
        "planning_punctual_id": 2641,
        "forfaitaire_item_id": null,
        "user_id": 8,
        "photo": [],
        "date": "2025-10-17",
        "material_id": 7,
        "created_at": "2025-10-17T13:54:03.158Z",
        "updated_at": "2025-10-17T13:54:03.158Z",
        "initial_material_id": 7,
        "is_changed": false,
        "return_raison": "first",
        "hour_start": "08:00",
        "hour_end": "17:00",
        "broken_place_lat": null,
        "broken_place_long": null,
        "file": [],
        "address": null,
        "user": {
            "id": 8,
            "first_name": "c",
            "last_name": "c",
            "job": "b",
            "role": "agent",
            "email": "c@c.com",
            "phone": "212121122121",
            "password_digest": "$2a$12$hV.BaFz8CcnXmVG0zk4.Re.vNpOtqgK8dqM81IwsEUTE1.fwX3WRC",
            "platform": "mobile",
            "btp": {
                "url": "https://apideo.webo.tn/uploads/user/btp/8/1740408283628.jpeg"
            },
            "cin": {
                "url": "https://apideo.webo.tn/uploads/user/cin/8/1745402614242.jpeg"
            },
            "rib": {
                "url": null
            },
            "driving_license": {
                "url": "https://apideo.webo.tn/uploads/user/driving_license/8/1745402633857.jpeg"
            },
            "type_user": 0,
            "photo": {
                "url": "https://apideo.webo.tn/uploads/user/photo/8/1745574213057.jpeg",
                "thumb": {
                    "url": "https://apideo.webo.tn/uploads/user/photo/8/thumb_1745574213057.jpeg"
                }
            },
            "active": true,
            "last_sign_in_at": "2025-10-16T09:38:07.569Z",
            "current_sign_in_at": "2025-10-17T13:53:56.771Z",
            "created_at": "2024-12-19T10:28:20.363Z",
            "updated_at": "2025-10-17T13:53:56.775Z",
            "address": "Ari",
            "is_driver": true,
            "is_teamleader": false,
            "lat": 0,
            "long": 0,
            "match_ia": 0,
            "identifier": "",
            "current_position_lat": 36.937827669009714,
            "current_position_long": 10.040455404754338,
            "mattermost_user_id": "mng5tpunw7diij953u6z7rim8w",
            "vehicle_insurance": {
                "url": null
            },
            "mutuelle": {
                "url": "https://apideo.webo.tn/uploads/user/mutuelle/8/1745403043678.jpeg"
            },
            "social_security": {
                "url": null
            },
            "proof_address": {
                "url": null
            },
            "gray_card": {
                "url": null
            },
            "device_token": "{\"token\":\"31F3EBE7AE80D67954ACEDF92D49F7C20CEAC4B71FE33A0F7437764A294F3B3B\",\"device\":\"ios\"}",
            "is_mission_supervisor": false,
            "type_agent": null
        },
        "material": {
            "id": 7,
            "name": "ES-046-FS",
            "type_material": "vehicule",
            "photo": {
                "url": "https://ideo.webo.tn/assets/img/default-user.png",
                "thumb": {
                    "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                }
            },
            "notes": "Au garage encore, à récupérer rapidement./2024-12-11: Defaut |return_id:47 | return_raison:has_issue/2025-01-28: panne|return_id:112 | return_raison:not_functional/2025-05-22: atyu|return_id:352 | return_raison:has_issue/2025-05-22: azerty|return_id:352 | return_raison:not_functional/2025-05-22: qazert|return_id:366 | return_raison:not_functional/2025-05-22: n|return_id:387 | return_raison:not_functional/2025-05-22: sdfsdfs|return_id:416 | return_raison:not_functional/2025-06-03: n|return_id:441 | return_raison:not_functional/2025-06-03: n|return_id:442 | return_raison:not_functional",
            "serial_number": null,
            "driver_id": 4,
            "grey_card": {
                "url": "https://apideo.webo.tn/uploads/material/grey_card/7/Scan_0015_2__2_(2).jpg"
            },
            "insurance": {
                "url": "https://apideo.webo.tn/uploads/material/insurance/7/ES-046-FS_2__2_(2).pdf"
            },
            "active": true,
            "created_at": "2024-03-25T12:28:48.262Z",
            "updated_at": "2025-06-03T09:21:12.042Z",
            "uniq": false,
            "address_recup": null,
            "lat": 48.9137322,
            "long": 2.3771928,
            "confirm_required": true
        }
    }
]
```













