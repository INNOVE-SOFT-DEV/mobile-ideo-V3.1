1.POST interventions/mission_return
formData

body : 
```js
     const uploadData = new FormData();
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
      uploadData.append("planning_punctual_id", this.planning.id);
      uploadData.append("important", this.important + "");
      //return_type      "empty_truck,rescheduling,accident,agent_absence"

      uploadData.append("return_type", this.returnTypes.join(","));
      uploadData.append(
        "return_time",
        new Date()
          .toLocaleString("fr-FR", {
            timeZone: "Europe/Paris"
          })
          .split(" ")[1] + ""
      );
      uploadData.append("date", new Date() + "");
```

succsess response without audio  
```json
{
    "id": 132,
    "planning_regular_id": null,
    "user_id": 8,
    "note": null,
    "created_at": "2025-10-17T14:47:34.136Z",
    "updated_at": "2025-10-17T14:53:11.006Z"
}
```
success response with audio 

```json
{
    "file": {
        "url": "https://apideo.webo.tn/uploads/mission_return_audio/file/1439/1760712820208.wav"
    },
    "id": 1439,
    "planning_regular_id": null,
    "user_id": 8,
    "note": null,
    "return_type": "agent_absence",
    "created_at": "2025-10-17T14:53:40.828Z",
    "updated_at": "2025-10-17T14:53:40.828Z"
}
```
2.GET interventions/mission_return/:id/:type
success response of  ==> /interventions/mission_return/2641/punctual

```json
[
    {
        "id": 132,
        "planning_punctual_id": 2641,
        "planning_regular_id": null,
        "user_id": 8,
        "return_type": "agent_absence,accident,empty_truck,rescheduling",
        "created_at": "2025-10-17T14:47:34.136Z",
        "updated_at": "2025-10-17T14:55:27.210Z",
        "note": null,
        "return_time": "16:47:33"
    }
]
```

2/GET /mission_return_audio/:id/:type
success response of  ==>  /mission_return_audio/2641/punctual

```json
[
    {
        "id": 1440,
        "planning_punctual_id": 2641,
        "planning_regular_id": null,
        "user_id": 8,
        "file": {
            "url": "https://apideo.webo.tn/uploads/mission_return_audio/file/1440/1760713606726.wav"
        },
        "important": true,
        "created_at": "2025-10-17T15:06:47.323Z",
        "updated_at": "2025-10-17T15:06:47.323Z",
        "date": "2025-10-17",
        "return_type": "",
        "note": null,
        "return_time": "17:06:46"
    }
] 
```



