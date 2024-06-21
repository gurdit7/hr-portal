export const gender = ["male", "female", "others"];
export const userType = ["all", "permanent", "trainee"];
export const designation = ['hr',  'manager', 'team lead', 'graphic designer', 'web designer', 'web developer', 'software tester', 'manual tester', 
'mern stack developer', 'full stack developer', 'frontend developer', 'node developer', 'php developer'];
export const userStatus = ['active', 'archive'];
export const department = ['seo', 'node', 'web development'];
export const leaveSort = [ 'all', 'approved', 'canceled', 'not-approved', 'pending', 'updated' ];
export const duration = ['Full Day', 'Half Day', 'Short Leave', 'Other'];

export const defaultTheme = {
    requestDocumentsSuccess:'Request Sent.',
    requestAppraisalSuccess:'Request Sent.',
    notificationsNoRecord:'You have no new notifications at the moment.',
    leavesNoRecord:'You have no leaves at the moment.'
}


export const rolesPermissions = {
    "general": [
        { 
            "item":"Read profile",
            "value":"read-profile"
        },
        { 
            "item":"Write profile",
            "value":"write-profile"
        }    
    ],
    "appraisal": [
        { 
            "item":"Apply appraisal",
            "value":"apply-appraisal"
        },
        { 
            "item":"View appraisal",
            "value":"view-appraisal"
        },
        { 
            "item":"View Users appraisals",
            "value":"view-users-appraisals"
        },
        { 
            "item":"View Department appraisals",
            "info":"User will see his department or team's appraisals requests.",
            "value":"view-team-appraisals"
        },
        { 
            "item":"Write appraisal",
            "value":"write-appraisal"
        }
        ],
    "employees": [
        { 
            "item":"Read",
            "value":"read-employees"
        },
        { 
            "item":"Write",
            "value":"write-employees"
        }
    ],
    "designation": [
        { 
            "item":"Read",
            "value":"read-designation"
        },
        { 
            "item":"Write",
            "value":"write-designation"
        }
    ],
    "department": [
        { 
            "item":"Read",
            "value":"read-department"
        },
        { 
            "item":"Write",
            "value":"write-department"
        }
    ],
    "Request-Documents": [
        { 
            "item":"Apply Documents",
            "value":"apply-documents"
        },
        { 
            "item":"View Documents Request",
            "value":"view-documents"
        },
        { 
            "item":"View All Users Document Requests",
            "value":"view-users-documents"
        },
        { 
            "item":"View Department documents",
            "info":"User will see his department or team's document requests.",
            "value":"view-team-documents"
        },
        { 
            "item":"Write Documents",
            "value":"write-documents"
        }
        ],
    "notifications": [
        { 
            "item":"Read Other Users Notifications",
            "value":"view-users-notifications"
        },
        { 
            "item":"Write",
            "value":"add-notifications"
        },
        { 
            "item":"Cron Notifications",
            "value":"sandwich-leaves-update-cron-notifications"
        },
        { 
            "item":"View team notifications",
            "info":"User will see his department or team's notifications.",
            "value":"view-team-notifications"
        },
        { 
            "item":"User will read only his notifications",
            "value":"user-notifications"
        }        
    ],
    "create-Salary": [
        { 
            "item":"Write",
            "value":"create-salary"
        }
    ],
    "leaves": [
        { 
            "item":"Apply leave",
            "value":"apply-leaves"
        },
        { 
            "item":"Read leaves",
            "value":"read-leaves"
        },
        { 
            "item":"Read Other Users leaves",
            "value":"user-leaves"
        },
        { 
            "item":"View Department leaves",
            "info":"User will see his department or team's leaves requests.",
            "value":"view-team-leaves"
        },
        { 
            "item":"Approve & decline Other Users leaves",
            "value":"approve-decline-leaves"
        },
        { 
            "item":"User will read only his  balance leaves",
            "value":"balance-leaves"
        }        
    ],
    "holidays": [
        { 
            "item":"Read",
            "value":"read-holidays"
        },
        { 
            "item":"Write",
            "value":"write-holidays"
        }
    ],
    "roles": [
        { 
            "item":"Read",
            "value":"read-roles"
        },
        { 
            "item":"Write",
            "value":"write-roles"
        }
    ],
    "team": [
        { 
            "item":"Read",
            "value":"read-team"
        }     
    ]
    
}

