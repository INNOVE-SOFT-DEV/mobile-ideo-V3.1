1. GET /missions/plannings/${date}/${type}/${isAgent} 
Content-Type": "application/json

Case 1  (normal agent)
params : (date today date or filter date, type: 'all', isAgent: true)
isAgent true ==> return all types of plannings  when the user is included

success response of /missions/plannings/2025-10-14/all/true

```json
{
    "punctuals": [
        {
            "id": 5383,
            "planning_punctual_id": 5383,
            "agent_needed": 5,
            "mattermost_channel_id": "7gep9j64yjf48xdi5bk7pqib9y",
            "date": "2025-10-15",
            "intervention_id": 200,
            "intervention_name": "VINCI IMMOBILIER - Boulevard Colonel Arnaud Beltrame, Saint-Cyr-l'École, France",
            "address": "Boulevard Colonel Arnaud Beltrame, Saint-Cyr-l'École, France",
            "long": "2.0710427",
            "lat": "48.8072819",
            "logo": {
                "url": "https://backend.ideogroupe.com/uploads/client/logo/26/photo(2).png",
                "thumb": {
                    "url": "https://backend.ideogroupe.com/uploads/client/logo/26/thumb_photo(2).png"
                }
            },
            "prestation": "NETTOYAGE EN INTERVENTION PONCTUELLE :",
            "prestation_id": 7,
            "mission": "<div>Vérification rapide des halls et faire la liste des logements de mardi nickel et commencer ceux de mercredi si vous pouvez.</div>",
            "remark": "<div>finition et aykel suivis livraison des logements du jours</div>",
            "contacts": [
                {
                    "id": 3,
                    "intervention_contact_id": 216,
                    "name": "OGAL MOHAMED",
                    "phone": "0750961183",
                    "email": "mogal@ers-ingenierie.fr",
                    "role": "Externe"
                },
                {
                    "id": 264,
                    "intervention_contact_id": 412,
                    "name": "OMONT Gautier",
                    "phone": "0763629070",
                    "email": "gautier.omont@vinci-immobilier.com",
                    "role": "Interne"
                }
            ],
            "team": [
                {
                    "id": 4,
                    "planning_punctual_agent_id": 12171,
                    "first_name": "AOUINI",
                    "last_name": "Mokhtar",
                    "is_extern": false,
                    "is_driver": true,
                    "hour_start": "08h:00",
                    "hour_end": "17h:00",
                    "role": "teamleader",
                    "absent": false,
                    "phone": "0758110307",
                    "first_pointing_internal": [],
                    "second_pointing_internal": [
                        {
                            "id": 20548,
                            "user_id": 4,
                            "intervention_id": 200,
                            "date": "2025-10-15",
                            "planning_punctual_agent_id": 12171,
                            "planning_regular_agent_id": null,
                            "lat": 48.803121,
                            "long": 2.0725469,
                            "created_at": "2025-10-14T17:21:42.246Z",
                            "updated_at": "2025-10-15T06:04:32.183Z",
                            "extra_hours": null,
                            "lat_2": null,
                            "long_2": null,
                            "hour_start": "08:04",
                            "hour_end": null,
                            "pointage_valide": false,
                            "panier_repas": "0.0",
                            "heure_travail": null,
                            "admin_user_id": null,
                            "forfaitaire_agent_id": null
                        }
                    ],
                    "is_supervisor_agent": true,
                    "vehicule": {
                        "id": 8,
                        "name": "berlingo EA-479-GZ",
                        "type_material": "vehicule",
                        "photo": {
                            "url": "https://ideo.webo.tn/assets/img/default-user.png",
                            "thumb": {
                                "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                            }
                        },
                        "notes": null,
                        "serial_number": null,
                        "driver_id": 4,
                        "grey_card": {
                            "url": "https://api.ideogroupe.com/uploads/material/grey_card/8/Scan_0021_2_.jpg"
                        },
                        "insurance": {
                            "url": "https://api.ideogroupe.com/uploads/material/insurance/8/FL-215-GS_2_.pdf"
                        },
                        "active": true,
                        "created_at": "2024-03-25T12:29:06.339Z",
                        "updated_at": "2024-06-25T17:17:20.241Z",
                        "uniq": false,
                        "address_recup": null,
                        "lat": null,
                        "long": null,
                        "confirm_required": true
                    },
                    "vehicule_returns": {
                        "id": 903,
                        "planning_punctual_id": 5383,
                        "forfaitaire_item_id": null,
                        "user_id": 4,
                        "photo": [],
                        "date": "2025-10-15",
                        "material_id": 8,
                        "created_at": "2025-10-15T06:04:26.462Z",
                        "updated_at": "2025-10-15T06:04:26.462Z",
                        "initial_material_id": 8,
                        "is_changed": false,
                        "return_raison": "first",
                        "hour_start": "08:00",
                        "hour_end": "17:00",
                        "broken_place_lat": null,
                        "broken_place_long": null,
                        "file": [],
                        "address": null
                    }
                },
                {
                    "id": 18,
                    "planning_punctual_agent_id": 12172,
                    "first_name": "SMIAI",
                    "last_name": "Haykel",
                    "is_extern": false,
                    "is_driver": false,
                    "hour_start": "08h:00",
                    "hour_end": "17h:00",
                    "role": "agent",
                    "absent": false,
                    "phone": "0641410157",
                    "first_pointing_internal": [],
                    "second_pointing_internal": []
                },
                {
                    "id": 2421,
                    "subcontractor_agent_id": 11,
                    "planning_punctual_subcontractor_id": 1303,
                    "created_at": "2025-10-14T17:33:09.000Z",
                    "updated_at": "2025-10-14T17:33:09.000Z",
                    "sms_delivered": null,
                    "subcontractor_agent": {
                        "id": 11,
                        "subcontractor_id": 3,
                        "first_name": "BOUBACAR",
                        "last_name": "MAHAMANE",
                        "phone": "0758563583",
                        "address": "8 Rue David, Aubervilliers, France",
                        "lat": "48.9136971",
                        "long": "2.3774035",
                        "is_archived": false,
                        "subcontractor": {
                            "id": 3,
                            "company": "KOKO SIRA",
                            "created_at": "2024-03-27T13:48:18.329Z",
                            "updated_at": "2024-09-26T16:46:42.983Z",
                            "manager": "WAGUE Brahima",
                            "email": "kskokosira@gmail.com",
                            "phone": "0601283933",
                            "active": true,
                            "logo": {
                                "url": "https://ideo.webo.tn/assets/img/default-user.png",
                                "thumb": {
                                    "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                                }
                            },
                            "color": "#d20f36",
                            "address": null,
                            "siret": null,
                            "rate_agent": 0,
                            "rate_mission": 0
                        }
                    }
                },
                {
                    "id": 2422,
                    "subcontractor_agent_id": 3,
                    "planning_punctual_subcontractor_id": 1303,
                    "created_at": "2025-10-14T17:33:09.015Z",
                    "updated_at": "2025-10-14T17:33:09.015Z",
                    "sms_delivered": null,
                    "subcontractor_agent": {
                        "id": 3,
                        "subcontractor_id": 3,
                        "first_name": "TOUMANY",
                        "last_name": "SISSOKO",
                        "phone": "0605887160",
                        "address": "8 Rue David, Aubervilliers, France",
                        "lat": "48.9136971",
                        "long": "2.3774035",
                        "is_archived": false,
                        "subcontractor": {
                            "id": 3,
                            "company": "KOKO SIRA",
                            "created_at": "2024-03-27T13:48:18.329Z",
                            "updated_at": "2024-09-26T16:46:42.983Z",
                            "manager": "WAGUE Brahima",
                            "email": "kskokosira@gmail.com",
                            "phone": "0601283933",
                            "active": true,
                            "logo": {
                                "url": "https://ideo.webo.tn/assets/img/default-user.png",
                                "thumb": {
                                    "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                                }
                            },
                            "color": "#d20f36",
                            "address": null,
                            "siret": null,
                            "rate_agent": 0,
                            "rate_mission": 0
                        }
                    }
                },
                {
                    "id": 2423,
                    "subcontractor_agent_id": 8,
                    "planning_punctual_subcontractor_id": 1303,
                    "created_at": "2025-10-14T17:33:09.023Z",
                    "updated_at": "2025-10-14T17:33:09.023Z",
                    "sms_delivered": null,
                    "subcontractor_agent": {
                        "id": 8,
                        "subcontractor_id": 3,
                        "first_name": "SOULEYMANE",
                        "last_name": "KEITA",
                        "phone": "0766974232",
                        "address": "8 Rue David, Aubervilliers, France",
                        "lat": "48.9136971",
                        "long": "2.3774035",
                        "is_archived": false,
                        "subcontractor": {
                            "id": 3,
                            "company": "KOKO SIRA",
                            "created_at": "2024-03-27T13:48:18.329Z",
                            "updated_at": "2024-09-26T16:46:42.983Z",
                            "manager": "WAGUE Brahima",
                            "email": "kskokosira@gmail.com",
                            "phone": "0601283933",
                            "active": true,
                            "logo": {
                                "url": "https://ideo.webo.tn/assets/img/default-user.png",
                                "thumb": {
                                    "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                                }
                            },
                            "color": "#d20f36",
                            "address": null,
                            "siret": null,
                            "rate_agent": 0,
                            "rate_mission": 0
                        }
                    }
                }
            ],
            "mission_return": null,
            "showDetails": false,
            "hour_start": "08h:00",
            "hour_end": "17h:00",
            "punctual_info_photos": []
        }
    ],
    "regulars": [],
    "forfaitaires": [],
    "supervisors_contact": [
        {
            "first_name": "Bouzommita",
            "last_name": "Samir",
            "email": "s.bouzommita@hotmail.com",
            "phone": "0660568503",
            "id": null,
            "type_agent": null
        },
        {
            "first_name": "DAHAM",
            "last_name": "Faycal",
            "email": "fay67-cal@hotmail.it",
            "phone": "0624330521",
            "id": null,
            "type_agent": null
        }
    ]
}
```
Case 2 supervisor as agent 
get only plannings punctual where the connected user included in 

success response of /missions/plannings/2025-10-14/punctual/true

```json
{
    "punctuals": [
        {
            "id": 5372,
            "planning_punctual_id": 5372,
            "agent_needed": 1,
            "mattermost_channel_id": "a4pjhydz6ibqz8aa385e5annda",
            "date": "2025-10-14",
            "intervention_id": 341,
            "intervention_name": "SNC LIVRY GARGAN - 16 Avenue Léo Lagrange, Livry-Gargan, France",
            "address": "16 Avenue Léo Lagrange, Livry-Gargan, France",
            "long": "2.5187946",
            "lat": "48.9206544",
            "logo": {
                "url": "https://ideo.webo.tn/assets/img/default-company.png",
                "thumb": {
                    "url": "https://ideo.webo.tn/assets/img/thumb_default-company.png"
                }
            },
            "prestation": "Corvoyeurs / Bricolages",
            "prestation_id": 12,
            "mission": "<div>Continuer le bricolage&nbsp;</div>",
            "remark": "",
            "contacts": [
                {
                    "id": 119,
                    "intervention_contact_id": 498,
                    "name": "BOUZOUMITA Kaled .",
                    "phone": "0637452785",
                    "email": "b.kaled@ideogroupe.fr",
                    "role": "Externe"
                }
            ],
            "team": [
                {
                    "id": 13,
                    "planning_punctual_agent_id": 12136,
                    "first_name": "BEN BELGACEM",
                    "last_name": "Mahmoud",
                    "is_extern": false,
                    "is_driver": false,
                    "hour_start": "08h:00",
                    "hour_end": "17h:00",
                    "role": "agent",
                    "absent": false,
                    "phone": "0753210753",
                    "first_pointing_internal": [],
                    "second_pointing_internal": [
                        {
                            "id": 20514,
                            "user_id": 13,
                            "intervention_id": 341,
                            "date": "2025-10-14",
                            "planning_punctual_agent_id": 12136,
                            "planning_regular_agent_id": null,
                            "lat": 48.9206531,
                            "long": 2.5190832,
                            "created_at": "2025-10-13T17:17:58.125Z",
                            "updated_at": "2025-10-14T07:44:11.102Z",
                            "extra_hours": null,
                            "lat_2": null,
                            "long_2": null,
                            "hour_start": "09:44",
                            "hour_end": null,
                            "pointage_valide": false,
                            "panier_repas": "0.0",
                            "heure_travail": null,
                            "admin_user_id": null,
                            "forfaitaire_agent_id": null
                        }
                    ]
                },
                {
                    "id": 28,
                    "planning_punctual_agent_id": 12162,
                    "first_name": "Houssein",
                    "last_name": "SUPERVISEUR qsdsqd",
                    "is_extern": false,
                    "is_driver": false,
                    "hour_start": "08h:00",
                    "hour_end": "17h:00",
                    "role": "supervisor",
                    "absent": false,
                    "phone": "07 58 81 95 50ee",
                    "first_pointing_internal": [
                        {
                            "id": 20539,
                            "user_id": 28,
                            "intervention_id": 341,
                            "date": "2025-10-14",
                            "planning_punctual_agent_id": 12162,
                            "planning_regular_agent_id": null,
                            "lat": null,
                            "long": null,
                            "created_at": "2025-10-14T14:49:22.633Z",
                            "updated_at": "2025-10-14T14:49:22.633Z",
                            "extra_hours": null,
                            "lat_2": null,
                            "long_2": null,
                            "hour_start": null,
                            "hour_end": null,
                            "pointage_valide": false,
                            "panier_repas": "0.0",
                            "heure_travail": null,
                            "admin_user_id": null,
                            "forfaitaire_agent_id": null
                        }
                    ],
                    "second_pointing_internal": [
                        {
                            "id": 20539,
                            "user_id": 28,
                            "intervention_id": 341,
                            "date": "2025-10-14",
                            "planning_punctual_agent_id": 12162,
                            "planning_regular_agent_id": null,
                            "lat": null,
                            "long": null,
                            "created_at": "2025-10-14T14:49:22.633Z",
                            "updated_at": "2025-10-14T14:49:22.633Z",
                            "extra_hours": null,
                            "lat_2": null,
                            "long_2": null,
                            "hour_start": null,
                            "hour_end": null,
                            "pointage_valide": false,
                            "panier_repas": "0.0",
                            "heure_travail": null,
                            "admin_user_id": null,
                            "forfaitaire_agent_id": null
                        }
                    ],
                    "is_supervisor_agent": true
                }
            ],
            "mission_return": null,
            "showDetails": false,
            "hour_start": "08h:00",
            "hour_end": "17h:00",
            "punctual_info_photos": []
        }
    ],
    "supervisors_contact": [
        {
            "first_name": "Bouzommita",
            "last_name": "Samir",
            "email": "s.bouzommita@hotmail.com",
            "phone": "0660568503",
            "id": null,
            "type_agent": null
        },
        {
            "first_name": "DAHAM",
            "last_name": "Faycal",
            "email": "fay67-cal@hotmail.it",
            "phone": "0624330521",
            "id": null,
            "type_agent": null
        }
    ]
}
```
Case 3 noraml supervisor(sees all plannings by type with

success response of /missions/plannings/2025-10-14/punctual/false

```json
{
    "punctuals": [
        {
    "id": 5385,
    "planning_punctual_id": 5385,
    "agent_needed": 2,
    "mattermost_channel_id": "por8is6bu78oiecg53bggtzboc",
    "date": "2025-10-15",
    "intervention_id": 286,
    "intervention_name": "COGEDIM - Route de seine 95240 Cormeilles en parisis",
    "address": "Route de seine 95240 Cormeilles en parisis",
    "long": "2.1795372",
    "lat": "48.9569291",
    "logo": {
        "url": "https://backend.ideogroupe.com/uploads/client/logo/16/photo(2).png",
        "thumb": {
            "url": "https://backend.ideogroupe.com/uploads/client/logo/16/thumb_photo(2).png"
        }
    },
    "prestation": "NETTOYAGE EN INTERVENTION PONCTUELLE :",
    "prestation_id": 7,
    "mission": "<div>Débarrassage de déchets. Voir photos.</div>",
    "remark": "",
    "contacts": [
        {
            "id": 270,
            "intervention_contact_id": 380,
            "name": "BERTHELOT Julie ",
            "phone": "0763553681",
            "email": "jberthelot@cogedim.com",
            "role": "Interne"
        }
    ],
    "team": [
        {
            "id": 98,
            "planning_punctual_agent_id": 12189,
            "first_name": "GHOMMIDH",
            "last_name": "ZIED",
            "is_extern": false,
            "is_driver": true,
            "hour_start": "08h:00",
            "hour_end": "17h:00",
            "role": "teamleader",
            "absent": false,
            "phone": "0759610612",
            "first_pointing_internal": [],
            "second_pointing_internal": [
                {
                    "id": 20566,
                    "user_id": 98,
                    "intervention_id": 286,
                    "date": "2025-10-15",
                    "planning_punctual_agent_id": 12189,
                    "planning_regular_agent_id": null,
                    "lat": 48.953424,
                    "long": 2.1753594,
                    "created_at": "2025-10-15T11:31:01.277Z",
                    "updated_at": "2025-10-15T12:51:53.616Z",
                    "extra_hours": null,
                    "lat_2": null,
                    "long_2": null,
                    "hour_start": "14:51",
                    "hour_end": null,
                    "pointage_valide": false,
                    "panier_repas": "0.0",
                    "heure_travail": null,
                    "admin_user_id": null,
                    "forfaitaire_agent_id": null
                }
            ]
        },
        {
            "id": 23,
            "planning_punctual_agent_id": 12188,
            "first_name": "MAHAMADOU",
            "last_name": "Drame",
            "is_extern": false,
            "is_driver": false,
            "hour_start": "08h:00",
            "hour_end": "17h:00",
            "role": "agent",
            "absent": false,
            "phone": "0744639486",
            "first_pointing_internal": [],
            "second_pointing_internal": [
                {
                    "id": 20565,
                    "user_id": 23,
                    "intervention_id": 286,
                    "date": "2025-10-15",
                    "planning_punctual_agent_id": 12188,
                    "planning_regular_agent_id": null,
                    "lat": 48.95942260923336,
                    "long": 2.1808469103328463,
                    "created_at": "2025-10-15T11:31:01.209Z",
                    "updated_at": "2025-10-15T12:28:07.494Z",
                    "extra_hours": null,
                    "lat_2": null,
                    "long_2": null,
                    "hour_start": "14:28",
                    "hour_end": null,
                    "pointage_valide": false,
                    "panier_repas": "0.0",
                    "heure_travail": null,
                    "admin_user_id": null,
                    "forfaitaire_agent_id": null
                }
            ]
        }
    ],
    "mission_return": null,
    "showDetails": false,
    "hour_start": "08h:00",
    "hour_end": "17h:00",
    "punctual_info_photos": []
},

{
    "id": 5383,
    "planning_punctual_id": 5383,
    "agent_needed": 5,
    "mattermost_channel_id": "7gep9j64yjf48xdi5bk7pqib9y",
    "date": "2025-10-15",
    "intervention_id": 200,
    "intervention_name": "VINCI IMMOBILIER - Boulevard Colonel Arnaud Beltrame, Saint-Cyr-l'École, France",
    "address": "Boulevard Colonel Arnaud Beltrame, Saint-Cyr-l'École, France",
    "long": "2.0710427",
    "lat": "48.8072819",
    "logo": {
        "url": "https://backend.ideogroupe.com/uploads/client/logo/26/photo(2).png",
        "thumb": {
            "url": "https://backend.ideogroupe.com/uploads/client/logo/26/thumb_photo(2).png"
        }
    },
    "prestation": "NETTOYAGE EN INTERVENTION PONCTUELLE :",
    "prestation_id": 7,
    "mission": "<div>Vérification rapide des halls et faire la liste des logements de mardi nickel et commencer ceux de mercredi si vous pouvez.</div>",
    "remark": "<div>finition et aykel suivis livraison des logements du jours</div>",
    "contacts": [
        {
            "id": 3,
            "intervention_contact_id": 216,
            "name": "OGAL MOHAMED",
            "phone": "0750961183",
            "email": "mogal@ers-ingenierie.fr",
            "role": "Externe"
        },
        {
            "id": 264,
            "intervention_contact_id": 412,
            "name": "OMONT Gautier",
            "phone": "0763629070",
            "email": "gautier.omont@vinci-immobilier.com",
            "role": "Interne"
        }
    ],
    "team": [
        {
            "id": 4,
            "planning_punctual_agent_id": 12171,
            "first_name": "AOUINI",
            "last_name": "Mokhtar",
            "is_extern": false,
            "is_driver": true,
            "hour_start": "08h:00",
            "hour_end": "17h:00",
            "role": "teamleader",
            "absent": false,
            "phone": "0758110307",
            "first_pointing_internal": [],
            "second_pointing_internal": [
                {
                    "id": 20548,
                    "user_id": 4,
                    "intervention_id": 200,
                    "date": "2025-10-15",
                    "planning_punctual_agent_id": 12171,
                    "planning_regular_agent_id": null,
                    "lat": 48.803121,
                    "long": 2.0725469,
                    "created_at": "2025-10-14T17:21:42.246Z",
                    "updated_at": "2025-10-15T06:04:32.183Z",
                    "extra_hours": null,
                    "lat_2": null,
                    "long_2": null,
                    "hour_start": "08:04",
                    "hour_end": null,
                    "pointage_valide": false,
                    "panier_repas": "0.0",
                    "heure_travail": null,
                    "admin_user_id": null,
                    "forfaitaire_agent_id": null
                }
            ],
            "vehicule": {
                "id": 8,
                "name": "berlingo EA-479-GZ",
                "type_material": "vehicule",
                "photo": {
                    "url": "https://ideo.webo.tn/assets/img/default-user.png",
                    "thumb": {
                        "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                    }
                },
                "notes": null,
                "serial_number": null,
                "driver_id": 4,
                "grey_card": {
                    "url": "https://api.ideogroupe.com/uploads/material/grey_card/8/Scan_0021_2_.jpg"
                },
                "insurance": {
                    "url": "https://api.ideogroupe.com/uploads/material/insurance/8/FL-215-GS_2_.pdf"
                },
                "active": true,
                "created_at": "2024-03-25T12:29:06.339Z",
                "updated_at": "2024-06-25T17:17:20.241Z",
                "uniq": false,
                "address_recup": null,
                "lat": null,
                "long": null,
                "confirm_required": true
            },
            "vehicule_returns": {
                "id": 903,
                "planning_punctual_id": 5383,
                "forfaitaire_item_id": null,
                "user_id": 4,
                "photo": [],
                "date": "2025-10-15",
                "material_id": 8,
                "created_at": "2025-10-15T06:04:26.462Z",
                "updated_at": "2025-10-15T06:04:26.462Z",
                "initial_material_id": 8,
                "is_changed": false,
                "return_raison": "first",
                "hour_start": "08:00",
                "hour_end": "17:00",
                "broken_place_lat": null,
                "broken_place_long": null,
                "file": [],
                "address": null
            }
        },
        {
            "id": 18,
            "planning_punctual_agent_id": 12172,
            "first_name": "SMIAI",
            "last_name": "Haykel",
            "is_extern": false,
            "is_driver": false,
            "hour_start": "08h:00",
            "hour_end": "17h:00",
            "role": "agent",
            "absent": false,
            "phone": "0641410157",
            "first_pointing_internal": [],
            "second_pointing_internal": []
        },
        {
            "id": 2421,
            "subcontractor_agent_id": 11,
            "planning_punctual_subcontractor_id": 1303,
            "created_at": "2025-10-14T17:33:09.000Z",
            "updated_at": "2025-10-14T17:33:09.000Z",
            "sms_delivered": null,
            "subcontractor_agent": {
                "id": 11,
                "subcontractor_id": 3,
                "first_name": "BOUBACAR",
                "last_name": "MAHAMANE",
                "phone": "0758563583",
                "address": "8 Rue David, Aubervilliers, France",
                "lat": "48.9136971",
                "long": "2.3774035",
                "is_archived": false,
                "subcontractor": {
                    "id": 3,
                    "company": "KOKO SIRA",
                    "created_at": "2024-03-27T13:48:18.329Z",
                    "updated_at": "2024-09-26T16:46:42.983Z",
                    "manager": "WAGUE Brahima",
                    "email": "kskokosira@gmail.com",
                    "phone": "0601283933",
                    "active": true,
                    "logo": {
                        "url": "https://ideo.webo.tn/assets/img/default-user.png",
                        "thumb": {
                            "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                        }
                    },
                    "color": "#d20f36",
                    "address": null,
                    "siret": null,
                    "rate_agent": 0,
                    "rate_mission": 0
                }
            }
        },
        {
            "id": 2422,
            "subcontractor_agent_id": 3,
            "planning_punctual_subcontractor_id": 1303,
            "created_at": "2025-10-14T17:33:09.015Z",
            "updated_at": "2025-10-14T17:33:09.015Z",
            "sms_delivered": null,
            "subcontractor_agent": {
                "id": 3,
                "subcontractor_id": 3,
                "first_name": "TOUMANY",
                "last_name": "SISSOKO",
                "phone": "0605887160",
                "address": "8 Rue David, Aubervilliers, France",
                "lat": "48.9136971",
                "long": "2.3774035",
                "is_archived": false,
                "subcontractor": {
                    "id": 3,
                    "company": "KOKO SIRA",
                    "created_at": "2024-03-27T13:48:18.329Z",
                    "updated_at": "2024-09-26T16:46:42.983Z",
                    "manager": "WAGUE Brahima",
                    "email": "kskokosira@gmail.com",
                    "phone": "0601283933",
                    "active": true,
                    "logo": {
                        "url": "https://ideo.webo.tn/assets/img/default-user.png",
                        "thumb": {
                            "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                        }
                    },
                    "color": "#d20f36",
                    "address": null,
                    "siret": null,
                    "rate_agent": 0,
                    "rate_mission": 0
                }
            }
        },
        {
            "id": 2423,
            "subcontractor_agent_id": 8,
            "planning_punctual_subcontractor_id": 1303,
            "created_at": "2025-10-14T17:33:09.023Z",
            "updated_at": "2025-10-14T17:33:09.023Z",
            "sms_delivered": null,
            "subcontractor_agent": {
                "id": 8,
                "subcontractor_id": 3,
                "first_name": "SOULEYMANE",
                "last_name": "KEITA",
                "phone": "0766974232",
                "address": "8 Rue David, Aubervilliers, France",
                "lat": "48.9136971",
                "long": "2.3774035",
                "is_archived": false,
                "subcontractor": {
                    "id": 3,
                    "company": "KOKO SIRA",
                    "created_at": "2024-03-27T13:48:18.329Z",
                    "updated_at": "2024-09-26T16:46:42.983Z",
                    "manager": "WAGUE Brahima",
                    "email": "kskokosira@gmail.com",
                    "phone": "0601283933",
                    "active": true,
                    "logo": {
                        "url": "https://ideo.webo.tn/assets/img/default-user.png",
                        "thumb": {
                            "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                        }
                    },
                    "color": "#d20f36",
                    "address": null,
                    "siret": null,
                    "rate_agent": 0,
                    "rate_mission": 0
                }
            }
        }
    ],
    "mission_return": null,
    "showDetails": false,
    "hour_start": "08h:00",
    "hour_end": "17h:00",
    "punctual_info_photos": []
}
             
    ],
    "supervisors_contact": [
        {
            "first_name": "Bouzommita",
            "last_name": "Samir",
            "email": "s.bouzommita@hotmail.com",
            "phone": "0660568503",
            "id": null,
            "type_agent": null
        },
        {
            "first_name": "DAHAM",
            "last_name": "Faycal",
            "email": "fay67-cal@hotmail.it",
            "phone": "0624330521",
            "id": null,
            "type_agent": null
        }
    ]
}
```
success response of  /missions/plannings/2025-10-14/regular/false
```json
{
    "regulars": [
        {
            "id": 338,
            "planning_regular_id": 338,
            "mattermost_channel_id": "zardw39rwf8r5871ainjnch34y",
            "date_start": "2025-10-06",
            "date_end": "2025-10-31",
            "intervention_id": 406,
            "intervention_days": "2025-10-06,2025-10-07,2025-10-08,2025-10-09,2025-10-10,2025-10-13,2025-10-14,2025-10-15,2025-10-16,2025-10-17,2025-10-20,2025-10-21,2025-10-22,2025-10-23,2025-10-24,2025-10-27,2025-10-28,2025-10-29,2025-10-30,2025-10-31",
            "intervention_name": "PITCH IMMO - 74 Rue Jean Jacques Rousseau, 92700 Colombes, France",
            "address": "74 Rue Jean Jacques Rousseau, 92700 Colombes, France",
            "long": "2.2650767",
            "lat": "48.9323543",
            "logo": {
                "url": "https://ideo.webo.tn/assets/img/default-company.png",
                "thumb": {
                    "url": "https://ideo.webo.tn/assets/img/thumb_default-company.png"
                }
            },
            "prestation": "Gestionnaire de clé",
            "prestation_id": 28,
            "mission": "<div>Gestionnaire de clés.<br>Voir avec arthur.</div>",
            "remark": "<div>Fermeture des fenetres et portes en fin de journée.</div>",
            "contacts": [
                {
                    "id": 108,
                    "intervention_contact_id": 592,
                    "name": "ALCARAS .Arthur",
                    "phone": "0699409883",
                    "email": "aalcaras@cogedim.com",
                    "role": "Externe"
                }
            ],
            "team": [
                {
                    "id": 20,
                    "planning_regular_agent_id": 311,
                    "first_name": "SAYEM",
                    "last_name": "Abdessalam",
                    "is_extern": false,
                    "is_driver": false,
                    "hour_start": "08h:00",
                    "hour_end": "17h:00",
                    "role": "agent",
                    "phone": "0767558724",
                    "photo": {
                        "url": "https://ideo.webo.tn/assets/img/default-user.png",
                        "thumb": {
                            "url": "https://ideo.webo.tn/assets/img/thumb_default-user.png"
                        }
                    },
                    "first_pointing_internal": [],
                    "second_pointing_internal": [
                        {
                            "id": 20329,
                            "user_id": 20,
                            "intervention_id": 406,
                            "date": "2025-10-14",
                            "planning_punctual_agent_id": null,
                            "planning_regular_agent_id": 311,
                            "lat": 48.9309934,
                            "long": 2.2610772,
                            "created_at": "2025-10-05T22:01:48.099Z",
                            "updated_at": "2025-10-14T04:57:40.529Z",
                            "extra_hours": null,
                            "lat_2": null,
                            "long_2": null,
                            "hour_start": "06:57",
                            "hour_end": null,
                            "pointage_valide": false,
                            "panier_repas": "0.0",
                            "heure_travail": null,
                            "admin_user_id": null,
                            "forfaitaire_agent_id": null
                        }
                    ]
                }
            ],
            "showDetails": false,
            "date": "2025-10-14"
        },


 
    ],
    "supervisors_contact": [
        {
            "first_name": "Bouzommita",
            "last_name": "Samir",
            "email": "s.bouzommita@hotmail.com",
            "phone": "0660568503",
            "id": null,
            "type_agent": null
        },
        {
            "first_name": "DAHAM",
            "last_name": "Faycal",
            "email": "fay67-cal@hotmail.it",
            "phone": "0624330521",
            "id": null,
            "type_agent": null
        }
    ]
}
```
success response of  /missions/plannings/2025-10-14/forfaitaire/false

```json
{
    "forfaitaires": [],
    "supervisors_contact": [
        {
            "first_name": "Bouzommita",
            "last_name": "Samir",
            "email": "s.bouzommita@hotmail.com",
            "phone": "0660568503",
            "id": null,
            "type_agent": null
        },
        {
            "first_name": "DAHAM",
            "last_name": "Faycal",
            "email": "fay67-cal@hotmail.it",
            "phone": "0624330521",
            "id": null,
            "type_agent": null
        }
    ]
}
```


2 GET missions/supervisor_plannings_counts/${date}

API-V2/app/controllers/missions_controller.rb

Content-Type": "application/json

success response of /missions/supervisor_plannings_counts/2025-10-14


```json
{
    "punctuals_count": 12,
    "regulars_count": 9,
    "forfaitaires_count": 0,
    "supervisor_punctuals_count": 1
}
```

