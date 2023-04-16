### Overview ###

The Address Auto-Complete is an extension to enhance the customer(s) shopping experience. It enhances the address fields in the checkout, multi-shipping checkout, and user account settings. As the customer starts typing the address in the address field the extension DeveloperHub_AddressAutoComplete will show the customer a list of matching addresses by using the customer’s location. Once the customer selects one of the addresses in the generated list, the rest of the address fields are automatically filled to save the customer's time. This extension works for the community, enterprise, and cloud versions.

### Features ###

Works in address fields of checkout, multi-shipping checkout, and user account settings.
Increase accuracy in address fields.
Generates a list of relevant addresses as soon as the customer starts typing in address fields.
Autofills address fields when the customer selects an address from the generated list.
Customers can enter any address, international or domestic.

## Installation

1. Please run the following command
```shell
composer require devhub/core
composer require devhub/address-auto-complete
```

2. Update the composer if required
```shell
composer update
```

3. Enable module
```shell
php bin/magento module:enable DeveloperHub_Core
php bin/magento module:enable DeveloperHub_AddressAutoComplete
php bin/magento setup:upgrade
php bin/magento cache:clean
php bin/magento cache:flush
```
4.If your website is running in product mode the you need to deploy static content and
then clear the cache
```shell
php bin/magento setup:static-content:deploy
php bin/magento setup:di:compile
```



#####This extension is compatible with all the versions of Magento 2.3.* and 2.4.*.
###Tested on following instances:
#####multiple instances i.e. 2.3.7-p4 and 2.4.5p1
