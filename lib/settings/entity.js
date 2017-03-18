import configTemplate from './config.html';

module.exports = function(nga, admin) {

  var settings = admin.getEntity('settings');
  settings.identifier(nga.field('_id'));

  settings.editionView()
    .template(configTemplate)
    .title('Configuración')
    .fields([
      nga.field('domicilio', 'number')  // 0
        .label('Valor del Domicilio'),
      nga.field('terminosCondiciones', 'text')  // 1
        .label('Términos y Condiciones'),
      nga.field('sobreEmpresa', 'text')  // 2
        .label('Sobre la Empresa'),
      nga.field('empresa.nombre')  // 3
        .label('Nombre de la Empresa'),
      nga.field('empresa.nit')
        .label('NIT'),
      nga.field('empresa.direccion')
        .label('Dirección'),
      nga.field('empresa.telefono')
        .label('Teléfono'),
      nga.field('empresa.ciudad')
        .label('Ciudad'),
      nga.field('empresa.regimenTributario')
        .label('Regimen Tributario'),
      nga.field('factura.prefijo')
        .label('Prefijo de la Factura de Venta'),
      nga.field('factura.dian', 'text')
        .label('Resolución DIAN'),
      nga.field('factura.dianFecha', 'text')
        .label('Fecha de Autorización'),
      nga.field('factura.dianHabilita', 'text')
        .label('Numeración Habilitada'),
      nga.field('factura.dianMsg', 'text')
        .label('Mensaje de Retención'),
      nga.field('factura.account', 'text')
        .label('Nota de Consignación'),
      nga.field('factura.note', 'text')
        .label('Pie de Factura'),
    ]);

  return settings;
}
