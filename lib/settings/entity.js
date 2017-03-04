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
      nga.field('empresa.representante')  // 4
        .label('Representante Legal'),
      nga.field('empresa.nit')  // 5
        .label('NIT'),
      nga.field('empresa.regimenTributario')  // 6
        .label('Regimen Tributario'),
      nga.field('empresa.direccion')  // 7
        .label('Dirección'),
      nga.field('empresa.telefono')  // 8
        .label('Teléfono'),
      nga.field('empresa.ciudad')  // 9
        .label('Ciudad'),
      nga.field('factura.prefijo')  // 10
        .label('Prefijo de la Factura de Venta'),
      nga.field('factura.dian')  // 11
        .label('Resolución DIAN')
    ])
    .actions([]);

  return settings;
}
