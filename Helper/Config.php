<?php

namespace DeveloperHub\AddressAutoComplete\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\Encryption\EncryptorInterface;
use Magento\Framework\App\Helper\Context;
use Magento\Store\Model\ScopeInterface;

class Config extends AbstractHelper
{
    /** @var EncryptorInterface */
    protected $encryptor;

    /**
     * @param Context $context
     * @param EncryptorInterface $encryptor
     */
    public function __construct(
        Context $context,
        EncryptorInterface $encryptor
    ) {
        parent::__construct($context);
        $this->encryptor = $encryptor;
    }

    /** @return mixed */
    public function getApiKey()
    {
        return $this->encryptor->decrypt(
            $this->scopeConfig->getValue(
                "address_autocomplete/general/google_api_key",
                ScopeInterface::SCOPE_STORE
            )
        );
    }
}
