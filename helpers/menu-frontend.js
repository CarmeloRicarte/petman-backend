const getMenuFrontend = (rol = 'USER_ROLE') => {
    const menu = [
        {
            titulo: 'Principal',
            icono: 'pi pi-home',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Gráficos', url: '/graficos' }
            ]
        },
        {
            titulo: 'Gestión de productos',
            icono: 'pi pi-folder-open',
            submenu: [
                { titulo: 'Productos', url: '/productos' },
                { titulo: 'Categorías', url: '/categorias' },
                { titulo: 'Subcategorias', url: '/subcategorias' },
            ]
        },
        {
            titulo: 'Gestión de logística',
            icono: 'pi pi-send',
            submenu: [
                { titulo: 'Envíos de mercancía', url: '/envio-mercancia' },
                { titulo: 'Recepciones de mercancía', url: '/recepcion-mercancia' },
            ]
        },
        {
            titulo: 'Clientes y Proveedores',
            icono: 'pi pi-phone',
            submenu: [
                { titulo: 'Listado de Clientes', url: '/clientes' },
                { titulo: 'Listado de Proveedores', url: '/proveedores' },
            ]
        }
    ];

    if (rol === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
};

module.exports = {
    getMenuFrontend
}