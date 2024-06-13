export const gender = ["male", "female", "others"];
export const userType = ["all", "permanent", "trainee"];
export const designation = ['hr',  'manager', 'team lead', 'graphic designer', 'web designer', 'web developer', 'software tester', 'manual tester', 
'mern stack developer', 'full stack developer', 'frontend developer', 'node developer', 'php developer'];
export const userStatus = ['active', 'archive'];
export const department = ['seo', 'node', 'web development'];
export const leaveSort = [ 'all', 'approved', 'canceled', 'not-approved', 'pending' ];
export const duration = ['Full Day', 'Half Day', 'Short Leave', 'Other'];

export const defaultTheme = {
    requestDocumentsSuccess:'Request Sent.',
    requestAppraisalSuccess:'Request Sent.',
    notificationsNoRecord:'You have no new notifications at the moment.',
    leavesNoRecord:'You have no leaves at the moment.'
}


export const rolesPermissions = {
    "appraisal": [
        { 
            "item":"Apply",
            "value":"apply-appraisal"
        },
        { 
            "item":"Read",
            "value":"read-appraisal"
        },
        { 
            "item":"Write",
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
            "item":"User will read only his notifications",
            "value":"user-notifications"
        }        
    ],
    "createSalary": [
        { 
            "item":"Write",
            "value":"create-salary"
        }
    ],
    "leaves": [
        { 
            "item":"Read Other Users leaves",
            "value":"user-leaves"
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

