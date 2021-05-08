const getMenuFrontend = (rol = 'USER_ROLE') => {
    const menu = [
        {
            titulo: 'Principal',
            icono: 'pi pi-home',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard', icono: 'pi pi-info-circle' },
                { titulo: 'Gráficos', url: '/graficos', icono: 'pi pi-chart-bar', }
            ]
        },
        {
            titulo: 'Gestión de productos',
            icono: 'pi pi-folder',
            submenu: [
                { titulo: 'Productos', url: '/productos', icono: 'pi pi-folder-open' },
                { titulo: 'Categorías', url: '/categorias', icono: 'pi pi-caret-up' },
                { titulo: 'Subcategorias', url: '/subcategorias', icono: 'pi pi-caret-down' },
            ]
        },
        {
            titulo: 'Gestión de logística',
            icono: 'pi pi-list',
            submenu: [
                { titulo: 'Envíos de mercancía', url: '/envio-mercancia', icono: 'pi pi-send', },
                { titulo: 'Recepciones de mercancía', url: '/recepcion-mercancia', icono: 'pi pi-directions-alt', },
            ]
        },
        {
            titulo: 'Clientes y Proveedores',
            icono: 'pi pi-phone',
            submenu: [
                { titulo: 'Listado de Clientes', url: '/clientes', icono: 'pi pi-id-card' },
                { titulo: 'Listado de Proveedores', url: '/proveedores', icono: 'pi pi-briefcase' },
            ]
        }
    ];

    if (rol === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios', icono: 'pi pi-users' });
    }

    return menu;
};

module.exports = {
    getMenuFrontend
}