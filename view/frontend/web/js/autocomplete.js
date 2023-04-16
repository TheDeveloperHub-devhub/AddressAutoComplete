define([
    'jquery',
    'uiComponent',
    'uiRegistry',
    'Magento_Checkout/js/checkout-data',
    'DeveloperHub_AddressAutoComplete/js/google_maps_loader'
], function (
    $,
    Component,
    uiRegistry,
    checkoutData,
    GoogleMapsLoader
) {

    let componentForm = {
        subpremise: 'short_name',
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'short_name',
        postal_code: 'short_name',
        postal_code_suffix: 'short_name',
        postal_town: 'short_name',
        sublocality_level_1: 'short_name'
    };

    let lookupElement = {
        street_number: 'street_1',
        route: 'street_2',
        locality: 'city',
        administrative_area_level_1: 'region',
        country: 'country_id',
        postal_code: 'postcode'
    };

    let googleMapError = false;
    window.gm_authFailure = function () {
        googleMapError = true;
    };

    GoogleMapsLoader.done(function () {
        let enabled = window.checkoutConfig.developerhub_autocomplete.active;

        let geocoder = new google.maps.Geocoder();
        setTimeout(function () {
            if (!googleMapError) {
                if (enabled == '1') {
                    let domID = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street').elems()[0].uid;

                    let street = $('#' + domID);

                    //SHQ18-260
                    let observer = new MutationObserver(function () {
                        observer.disconnect();
                        $("#" + domID).attr("autocomplete", "new-password");
                    });

                    street.each(function () {
                        let element = this;

                        observer.observe(element, {
                            attributes: true,
                            attributeFilter: ['autocomplete']
                        });

                        autocomplete = new google.maps.places.Autocomplete(
                            /** @type {!HTMLInputElement} */(this),
                            {types: ['geocode']}
                        );
                        autocomplete.addListener('place_changed', fillInAddress);

                    });
                    $('#' + domID).focus(geolocate);
                }
            }
        }, 5000);

    }).fail(function () {
        console.error("ERROR: Google maps library failed to load");
    });

    let fillInAddress = function () {
        let place = autocomplete.getPlace();

        let street = [];
        let region = '';
        let streetNumber = '';
        let city = '';
        let postcode = '';
        let postcodeSuffix = '';

        for (let i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                let value = place.address_components[i][componentForm[addressType]];
                if (addressType == 'subpremise') {
                    streetNumber = value + '/';
                } else if (addressType == 'street_number') {
                    streetNumber = streetNumber + value;
                } else if (addressType == 'route') {
                    street[1] = value;
                } else if (addressType == 'administrative_area_level_1') {
                    region = value;
                } else if (addressType == 'sublocality_level_1') {
                    city = value;
                } else if (addressType == 'postal_town') {
                    city = value;
                } else if (addressType == 'locality' && city == '') {
                    //ignore if we are using one of other city values already
                    city = value;
                } else if (addressType == 'postal_code') {
                    postcode = value;
                    let thisDomID = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.postcode').uid
                    if ($('#' + thisDomID).length) {
                        $('#' + thisDomID).val(postcode + postcodeSuffix);
                        $('#' + thisDomID).trigger('change');
                    }
                } else if (addressType == 'postal_code_suffix' && window.checkoutConfig.developerhub_autocomplete.use_long_postcode === '1') {
                    postcodeSuffix = '-' + value;
                    let thisDomID = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.postcode').uid
                    if ($('#' + thisDomID).length) {
                        $('#' + thisDomID).val(postcode + postcodeSuffix);
                        $('#' + thisDomID).trigger('change');
                    }
                } else {
                    let elementId = lookupElement[addressType];
                    if (elementId !== undefined) {
                        let thisDomID = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.' + elementId).uid;
                        if ($('#' + thisDomID).length) {
                            $('#' + thisDomID).val(value);
                            $('#' + thisDomID).trigger('change');
                        }
                    }
                }
            }
        }
        if (street.length > 0) {
            street[0] = streetNumber;
            let domID = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street').elems()[0].uid;
            let streetString = street.join(' ');
            if ($('#' + domID).length) {
                $('#' + domID).val(streetString);
                $('#' + domID).trigger('change');
            }
        }
        let cityDomID = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.city').uid;
        if ($('#' + cityDomID).length) {
            $('#' + cityDomID).val(city);
            $('#' + cityDomID).trigger('change');
        }
        if (region != '') {
            if (uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id')) {
                let regionDomId = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id').uid;
                if ($('#' + regionDomId).length) {
                    //search for and select region using text
                    $('#' + regionDomId + ' option')
                        .filter(function () {
                            return $.trim($(this).text()) == region;
                        })
                        .attr('selected', true);
                    $('#' + regionDomId).trigger('change');
                }
            }
            if (uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id_input')) {
                let regionDomId = uiRegistry.get('checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id_input').uid;
                if ($('#' + regionDomId).length) {
                    $('#' + regionDomId).val(region);
                    $('#' + regionDomId).trigger('change');
                }
            }
        }
    }

    geolocate = function () {
        if (navigator.geolocation && window.checkoutConfig.developerhub_autocomplete.use_geolocation === '1') {
            navigator.geolocation.getCurrentPosition(function (position) {
                let geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                let circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }

    return Component;
});
