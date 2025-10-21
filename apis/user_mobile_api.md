1.POST /auth/login
Content-Type: application/json

body : 

```js
{
  "email": "faidi@mail.com",
  "password": "123456",
  "device_id": "3daeda60-394a-4e39-9c29-9af64ec59a85",
  "platform": "web",
  "model": "iPhone",
  "operating_system": "ios",
  "os_version": "18.5",
  "manufacturer": "Google Inc.",
  "is_virtual": false,
  "web_view_version": ""
}
```

success response 

```json
{
  "user": {
    "last_sign_in_at": "2025-10-14T10:24:10.230Z",
    "current_sign_in_at": "2025-10-14T13:38:12.491Z",
    "photo": {
      "url": "https://apideo.webo.tn/uploads/user/photo/5/1759951148204.jpeg",
      "thumb": {
        "url": "https://apideo.webo.tn/uploads/user/photo/5/thumb_1759951148204.jpeg"
      }
    },
    "id": 5,
    "first_name": "faidi",
    "last_name": "ali",
    "job": "supervisor",
    "role": "supervisor",
    "email": "faidi@mail.com",
    "phone": "758819550",
    "platform": "mobile",
    "active": true,
    "created_at": "2024-12-02T14:35:25.204Z",
    "updated_at": "2025-10-14T13:38:12.493Z",
    "current_position_lat": 33.865728,
    "current_position_long": 10.0466688,
    "mattermost_user_id": "n7jhhtm3rtyumnm4xj9zbjdxuo",
    "is_mission_supervisor": true
  },
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3OTE5ODUwOTJ9.Xa5Cso6LFi5RExSmXi72PeKgq26rn8PutSAqzcCObko"
}
```
2.GET /user/get_user_by_id/${id} 
Content-Type: application/json

success response :

```json
{
    "id": 4,
    "first_name": "aaaaaaa",
    "last_name": "aaaaaaaa",
    "job": "a",
    "role": "agent",
    "email": "a@a.a",
    "phone": "0565656048400",
    "platform": "mobile",
    "btp": {
        "url": "https://apideo.webo.tn/uploads/user/btp/4/1735829109988.jpeg"
    },
    "cin": {
        "url": "https://apideo.webo.tn/uploads/user/cin/4/20241115_134113_1__1__1_.jpeg"
    },
    "rib": {
        "url": "https://apideo.webo.tn/uploads/user/rib/4/1735829124766.jpeg"
    },
    "driving_license": {
        "url": "https://apideo.webo.tn/uploads/user/driving_license/4/20241115_134113_1__1__1_.jpeg"
    },
    "type_user": 0,
    "photo": {
        "url": "https://ideo.webo.tn/assets/img/default-user.png",
        "thumb": {
            "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
        }
    },
    "active": true,
    "last_sign_in_at": "2025-03-05T18:43:35.780Z",
    "current_sign_in_at": "2025-03-07T13:04:23.999Z",
    "created_at": "2024-11-27T00:07:01.553Z",
    "updated_at": "2025-10-13T13:53:40.171Z",
    "address": "a",
    "is_driver": true,
    "is_teamleader": false,
    "lat": 0,
    "long": 0,
    "match_ia": 0,
    "identifier": "",
    "current_position_lat": 48.9136541,
    "current_position_long": 2.3774945,
    "vehicle_insurance": {
        "url": "https://apideo.webo.tn/uploads/user/vehicle_insurance/4/1735829144154.jpeg"
    },
    "mutuelle": {
        "url": "https://apideo.webo.tn/uploads/user/mutuelle/4/1735829138688.jpeg"
    },
    "social_security": {
        "url": "https://apideo.webo.tn/uploads/user/social_security/4/1735829130246.jpeg"
    },
    "proof_address": {
        "url": "https://apideo.webo.tn/uploads/user/proof_address/4/1735829119849.jpeg"
    },
    "gray_card": {
        "url": "https://apideo.webo.tn/uploads/user/gray_card/4/20241115_134113_1__1__1_.jpeg"
    },
    "device_token": null,
    "is_mission_supervisor": false,
    "type_agent": null
}
```
3. GET user/all_agents
Content-Type: application/json

success response :
```json

[
    {
        "id": 1,
        "first_name": "toumi",
        "last_name": "mohamed",
        "job": null,
        "role": "agent",
        "email": "toumi@mail.com",
        "phone": "3213123132",
        "platform": "mobile",
        "btp": {
            "url": null
        },
        "cin": {
            "url": null
        },
        "rib": {
            "url": null
        },
        "driving_license": {
            "url": null
        },
        "type_user": 0,
        "photo": {
            "url": "https://ideo.webo.tn/assets/img/default-user.png",
            "thumb": {
                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
            }
        },
        "active": true,
        "last_sign_in_at": "2025-01-16T12:33:22.804Z",
        "current_sign_in_at": "2025-01-16T15:23:28.014Z",
        "created_at": "2024-11-26T16:43:12.936Z",
        "updated_at": "2025-01-16T15:23:28.017Z",
        "address": "",
        "is_driver": false,
        "is_teamleader": false,
        "lat": 0,
        "long": 0,
        "match_ia": 0,
        "identifier": "",
        "current_position_lat": 33.882112,
        "current_position_long": 10.8560384,
        "vehicle_insurance": {
            "url": null
        },
        "mutuelle": {
            "url": null
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
        "device_token": null,
        "is_mission_supervisor": false,
        "type_agent": null
    },
    {
        "id": 4,
        "first_name": "aaaaaaa",
        "last_name": "aaaaaaaa",
        "job": "a",
        "role": "agent",
        "email": "a@a.a",
        "phone": "0565656048400",
        "platform": "mobile",
        "btp": {
            "url": "https://apideo.webo.tn/uploads/user/btp/4/1735829109988.jpeg"
        },
        "cin": {
            "url": "https://apideo.webo.tn/uploads/user/cin/4/20241115_134113_1__1__1_.jpeg"
        },
        "rib": {
            "url": "https://apideo.webo.tn/uploads/user/rib/4/1735829124766.jpeg"
        },
        "driving_license": {
            "url": "https://apideo.webo.tn/uploads/user/driving_license/4/20241115_134113_1__1__1_.jpeg"
        },
        "type_user": 0,
        "photo": {
            "url": "https://ideo.webo.tn/assets/img/default-user.png",
            "thumb": {
                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
            }
        },
        "active": true,
        "last_sign_in_at": "2025-03-05T18:43:35.780Z",
        "current_sign_in_at": "2025-03-07T13:04:23.999Z",
        "created_at": "2024-11-27T00:07:01.553Z",
        "updated_at": "2025-10-13T13:53:40.171Z",
        "address": "a",
        "is_driver": true,
        "is_teamleader": false,
        "lat": 0,
        "long": 0,
        "match_ia": 0,
        "identifier": "",
        "current_position_lat": 48.9136541,
        "current_position_long": 2.3774945,
        "vehicle_insurance": {
            "url": "https://apideo.webo.tn/uploads/user/vehicle_insurance/4/1735829144154.jpeg"
        },
        "mutuelle": {
            "url": "https://apideo.webo.tn/uploads/user/mutuelle/4/1735829138688.jpeg"
        },
        "social_security": {
            "url": "https://apideo.webo.tn/uploads/user/social_security/4/1735829130246.jpeg"
        },
        "proof_address": {
            "url": "https://apideo.webo.tn/uploads/user/proof_address/4/1735829119849.jpeg"
        },
        "gray_card": {
            "url": "https://apideo.webo.tn/uploads/user/gray_card/4/20241115_134113_1__1__1_.jpeg"
        },
        "device_token": null,
        "is_mission_supervisor": false,
        "type_agent": null
    }
]

```

4. POST user/update_user_data
Content-Type: application/json


body :
```js
   {
    "phone": "500600076",
    "password": "azerty",
    "user_id": 5
    }
```

success response

```json
{
    "user": {
        "phone": "500600076",
        "photo": {
            "url": "https://apideo.webo.tn/uploads/user/photo/5/1759951148204.jpeg",
            "thumb": {
                "url": "https://apideo.webo.tn/uploads/user/photo/5/thumb_1759951148204.jpeg"
            }
        },
        "btp": {
            "url": null
        },
        "cin": {
            "url": null
        },
        "rib": {
            "url": null
        },
        "driving_license": {
            "url": null
        },
        "vehicle_insurance": {
            "url": null
        },
        "mutuelle": {
            "url": null
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
        "id": 5,
        "first_name": "faidi",
        "last_name": "ali",
        "job": "supervisor",
        "role": "supervisor",
        "email": "faidi@mail.com",
        "platform": "mobile",
        "type_user": 0,
        "active": true,
        "last_sign_in_at": "2025-10-14T10:24:10.230Z",
        "current_sign_in_at": "2025-10-14T13:38:12.491Z",
        "created_at": "2024-12-02T14:35:25.204Z",
        "updated_at": "2025-10-14T14:08:03.366Z",
        "address": "",
        "is_driver": false,
        "is_teamleader": false,
        "lat": 0,
        "long": 0,
        "match_ia": 0,
        "identifier": "",
        "current_position_lat": 33.865728,
        "current_position_long": 10.0466688,
        "device_token": "{\"token\":\"dr_aLRhuREC3IlmMdh36Eu:APA91bEH6_RFvQb0AXheF7itIWKf5s8L7EHD70k5YTURHrmre2HD1O4XdYCZmJleRlS22yomA95zByL670ULTe9Tp1dPr7Pc-0Cq6mba1TP_gajUeXRSzdM\",\"device\":\"android\"}",
        "is_mission_supervisor": true,
        "type_agent": null
    },
    "is_updated": true
}
```
5. POST user/update_profile_picture 
FormData

body :
```js
uploadData.append("userId", userId);
uploadData.append("photo", blob, fileName);
```

success response : 

```json
{
    "message": "✅ User updated successfully",
    "user": {
        "id": 5,
        "first_name": "faidi",
        "last_name": "ali",
        "job": "supervisor",
        "role": "supervisor",
        "email": "faidi@mail.com",
        "phone": "500600076",
        "platform": "mobile",
        "btp": {
            "url": null
        },
        "cin": {
            "url": null
        },
        "rib": {
            "url": null
        },
        "driving_license": {
            "url": null
        },
        "type_user": 0,
        "photo": {
            "url": "https://apideo.webo.tn/uploads/user/photo/5/1760451533386.jpeg",
            "thumb": {
                "url": "https://apideo.webo.tn/uploads/user/photo/5/thumb_1760451533386.jpeg"
            }
        },
        "active": true,
        "last_sign_in_at": "2025-10-14T10:24:10.230Z",
        "current_sign_in_at": "2025-10-14T13:38:12.491Z",
        "created_at": "2024-12-02T14:35:25.204Z",
        "updated_at": "2025-10-14T14:18:54.111Z",
        "address": "",
        "is_driver": false,
        "is_teamleader": false,
        "lat": 0,
        "long": 0,
        "match_ia": 0,
        "identifier": "",
        "current_position_lat": 33.865728,
        "current_position_long": 10.0466688,
        "vehicle_insurance": {
            "url": null
        },
        "mutuelle": {
            "url": null
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
        "device_token": "{\"token\":\"dr_aLRhuREC3IlmMdh36Eu:APA91bEH6_RFvQb0AXheF7itIWKf5s8L7EHD70k5YTURHrmre2HD1O4XdYCZmJleRlS22yomA95zByL670ULTe9Tp1dPr7Pc-0Cq6mba1TP_gajUeXRSzdM\",\"device\":\"android\"}",
        "is_mission_supervisor": true,
        "type_agent": null
    }
}
```

6. PATCH /user
FormData

body : 

```js
     // doc_name : 'cin', 'btp' ... 
    uploadData.append(doc_name, blob, fileName);
```

success response

```json
{
    "cin": {
        "url": "https://apideo.webo.tn/uploads/user/cin/5/1760451909659.jpeg"
    },
    "photo": {
        "url": "https://apideo.webo.tn/uploads/user/photo/5/1760451533386.jpeg",
        "thumb": {
            "url": "https://apideo.webo.tn/uploads/user/photo/5/thumb_1760451533386.jpeg"
        }
    },
    "btp": {
        "url": null
    },
    "rib": {
        "url": null
    },
    "driving_license": {
        "url": null
    },
    "vehicle_insurance": {
        "url": null
    },
    "mutuelle": {
        "url": null
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
    "id": 5,
    "first_name": "faidi",
    "last_name": "ali",
    "job": "supervisor",
    "role": "supervisor",
    "email": "faidi@mail.com",
    "phone": "500600076",
    "platform": "mobile",
    "type_user": 0,
    "active": true,
    "last_sign_in_at": "2025-10-14T10:24:10.230Z",
    "current_sign_in_at": "2025-10-14T13:38:12.491Z",
    "created_at": "2024-12-02T14:35:25.204Z",
    "updated_at": "2025-10-14T14:25:10.218Z",
    "address": "",
    "is_driver": false,
    "is_teamleader": false,
    "lat": 0,
    "long": 0,
    "match_ia": 0,
    "identifier": "",
    "current_position_lat": 33.865728,
    "current_position_long": 10.0466688,
    "device_token": "{\"token\":\"dr_aLRhuREC3IlmMdh36Eu:APA91bEH6_RFvQb0AXheF7itIWKf5s8L7EHD70k5YTURHrmre2HD1O4XdYCZmJleRlS22yomA95zByL670ULTe9Tp1dPr7Pc-0Cq6mba1TP_gajUeXRSzdM\",\"device\":\"android\"}",
    "is_mission_supervisor": true,
    "type_agent": null
}
```





