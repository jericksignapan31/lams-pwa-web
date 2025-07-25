export const campuses = [
  {
    name: 'balubal campus',
    open: false,
    departments: [
      {
        name: 'IT department',
        open: false,
        rooms: ['ict lab 108', 'ict lab 107'],
      },
      {
        name: 'EMT department',
        open: false,
        rooms: ['room 101', 'room 102', 'room 103'],
      },
      {
        name: 'TCM department',
        open: false,
        rooms: ['room 201', 'room 202', 'room 203'],
      },
    ],
  },
  {
    name: 'villanueva campus',
    open: false,
    departments: [
      {
        name: 'IT department',
        open: false,
        rooms: ['ict lab 108', 'ict lab 107'],
      },
      {
        name: 'EMT department',
        open: false,
        rooms: ['room 101', 'room 102', 'room 103'],
      },
      {
        name: 'TCM department',
        open: false,
        rooms: ['room 201', 'room 202', 'room 203'],
      },
    ],
  },
];

export function getPanelMenuItems(role: string, assignedCampus?: string) {
  if (role === 'super admin') {
    return [
      {
        label: 'Inventory',
        icon: 'pi pi-warehouse',
        items: [
          {
            label: 'Equipment',
            icon: 'pi pi-cog',
            routerLink: '/home/equipments',
            items: [],
          },
          {
            label: 'Laboratories',
            icon: 'pi pi-flask',
            routerLink: '/home/laboratories',
            items: [],
          },
          ...campuses.map((campus) => ({
            label: campus.name,
            icon: 'pi pi-building',
            items: campus.departments.map((dept) => ({
              label: dept.name,
              icon: 'pi pi-building-columns',
              items: dept.rooms.map((room) => ({
                label: room,
                icon: 'pi pi-home',
                routerLink: '/home/equipments',
                items: [],
              })),
            })),
          })),
        ],
      },
    ];
  } else if (role === 'campus admin' || role === 'laboratory technician') {
    let inventoryMenu = {
      label: 'Inventory',
      icon: 'pi pi-warehouse',
      items: [] as any[],
    };
    if (assignedCampus) {
      const campus = campuses.find(
        (c) =>
          c.name.trim().toLowerCase() === assignedCampus.trim().toLowerCase()
      );
      if (campus) {
        inventoryMenu.items = [
          {
            label: 'Assets',
            icon: 'pi pi-cog',
            routerLink: '/home/equipments',
            items: [],
          },
          {
            label: 'Laboratories',
            icon: 'pi pi-flask',
            routerLink: '/home/laboratories',
            items: [],
          },
          ...campus.departments.map((dept) => ({
            label: dept.name,
            icon: 'pi pi-building-columns',
            items: dept.rooms.map((room) => ({
              label: room,
              icon: 'pi pi-home',
              items: [],
            })),
          })),
        ];
      } else {
        inventoryMenu.items = [
          {
            label: 'Assets',
            icon: 'pi pi-cog',
            routerLink: '/home/equipments',
            items: [],
          },
          {
            label: 'Laboratories',
            icon: 'pi pi-flask',
            routerLink: '/home/laboratories',
            items: [],
          },
        ];
      }
    } else {
      inventoryMenu.items = [
        {
          label: 'Equipment',
          icon: 'pi pi-cog',
          routerLink: '/home/equipments',
          items: [],
        },
        {
          label: 'Laboratories',
          icon: 'pi pi-flask',
          routerLink: '/home/laboratories',
          items: [],
        },
        { label: 'No campus assigned', icon: '', items: [] },
      ];
    }
    return [inventoryMenu, ...laboratoryPanelMenuModel];
  }
  return [];
}

export const dashboardMenuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-objects-column',
    items: [
      {
        label: 'Analytics',
        icon: 'pi pi-chart-bar',
        routerLink: '/home/dashboard',
      },
      {
        label: 'Reports',
        icon: 'pi pi-file',
        routerLink: '/home/reports',
      },
    ],
  },
];

export const laboratoryPanelMenuModel = [
  {
    label: 'Laboratory',
    icon: 'pi pi-flask',
    items: [
      {
        label: 'Laboratories',
        icon: 'pi pi-building',
        items: [],
        routerLink: '/home/laboratories',
      },
      {
        label: 'Schedule',
        icon: 'pi pi-calendar',
        items: [],
      },
    ],
  },
];

export const campusPanelMenu = [
  {
    label: 'Campus',
    icon: 'pi pi-building',
    items: [
      {
        label: 'Campuses',
        icon: 'pi pi-building',
        items: [],
        routerLink: '/home/campuses',
      },
    ],
  },
];

export const schoolManagementPanelMenu = [
  {
    label: 'School Management',
    icon: 'pi pi-sitemap',
    items: [
      {
        label: 'Departments',
        icon: 'pi pi-building-columns',
        items: [],
        routerLink: '/home/departments',
      },
      {
        label: 'Rooms',
        icon: 'pi pi-home',
        routerLink: '/home/rooms',
        items: [],
      },
    ],
  },
];
