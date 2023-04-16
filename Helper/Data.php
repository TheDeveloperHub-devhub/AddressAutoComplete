<?php

namespace DeveloperHub\AddressAutoComplete\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;

/**
 * Class Data
 * @package DeveloperHub\AddressAutoComplete\Helper
 */
class Data extends AbstractHelper
{
    /**
     * @param $configField
     * @return bool
     */
    public function getConfigFlag($configField)
    {
        return $this->scopeConfig->isSetFlag(
            $configField,
            ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * @param $configField
     * @param null $store
     * @return mixed
     */
    public function getConfigValue($configField, $store = null)
    {
        return $this->scopeConfig->getValue(
            $configField,
            ScopeInterface::SCOPE_STORE,
            $store
        );
    }
}
