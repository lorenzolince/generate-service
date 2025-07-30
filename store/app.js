export const getters = {
  getAllLinkMenu: () => {
    return [
      {
        key: 1,
        label: 'menu_1',
        nodes: [
          {
            key: 1,
            label: 'menu_1_1',
            nodes: [],
            url: "/datasourceOra"
          },
          {
            key: 2,
            label: 'menu_1_2',
            nodes: []  ,
            url: "/datasourceSqlServer"        
          } ,
          {
            key: 3,
            label: 'menu_1_3',
            nodes: []  ,
            url: "/datasourceMySql"        
          } ,
          {
            key: 4,
            label: 'menu_1_4',
            nodes: []  ,
            url: "/datasourcePostgres"        
          } 
        ]
      },
      {
        key: 2,
        label: 'menu_2',
        nodes: [
          /*{
            key: 1,
            label: 'menu_2_1',
            nodes: [],
            url: '/appModule'
          },*/   {
            key: 2,
            label: 'menu_2_2',
            nodes: [],
            url: '/queue'
          },   {
            key: 3,
            label: 'menu_2_3',
            nodes: [],
            url: '/sftp'
          },   {
            key: 4,
            label: 'menu_2_4',
            nodes: [],
            url: '/file'
          },   {
            key: 5,
            label: 'menu_2_5',
            nodes: [],
            url: '/job'
          }
        ]
      } ,{
        key: 3,
        label: 'menu_3',
        nodes: [
          {
            key: 1,
            label: 'menu_3_1',
            nodes: [],
            url: "/devops"
          },/*   {
            key: 2,
            label: 'menu_3_2',
            nodes: [],
            url: "/tokenApp"
          }*/
        ]
      },{
        key: 4,
        label: 'menu_4',
        nodes: [
          {
            key: 1,
            label: 'menu_4_1',
            nodes: [],
            url: "/events"
          } ,
            {
            key: 2,
            label: 'menu_4_2',
            nodes: [],
            url: '/pendingFiles'
          }  ,
            {
            key: 3,
            label: 'menu_4_3',
            nodes: [],
            url: '/credits'
          } 
        ]
      }
    ]
  }
}