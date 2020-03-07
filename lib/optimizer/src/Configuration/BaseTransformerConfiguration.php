<?php

namespace Amp\Optimizer\Configuration;

use Amp\Optimizer\Exception\InvalidConfigurationKey;
use Amp\Optimizer\Exception\UnknownConfigurationKey;
use Amp\Optimizer\TransformerConfiguration;

/**
 * Configuration for the AmpRuntimeCss transformer.
 *
 * @property string  $version Version string to use. Defaults to an empty string.
 * @property boolean $canary  Whether to use the canary version or not. Defaults to false.
 *
 * @package amp/optimizer
 */
abstract class BaseTransformerConfiguration implements TransformerConfiguration
{

    /**
     * Associative array of allowed keys and their respective default values.
     *
     * @var array
     */
    private $allowedKeys;

    /**
     * Instantiate an AmpRuntimeCssConfiguration object.
     *
     * @param array $configuration Optional. Associative array of configuration data. Defaults to an empty array.
     */
    public function __construct($configuration = [])
    {
        $this->allowedKeys = $this->getAllowedKeys();
        $configuration     = array_merge($this->allowedKeys, $configuration);

        foreach ($configuration as $key => $value) {
            if (! array_key_exists($key, $this->allowedKeys)) {
                throw InvalidConfigurationKey::fromTransformerKey(self::class, $key);
            }
            $this->$key = $this->validate($key, $value);
        }
    }

    /**
     * Get the value for a given key.
     *
     * The key is assumed to exist and will throw an exception if it can't be retrieved.
     * This means that all configuration entries should come with a default value.
     *
     * @param string $key Key of the configuration entry to retrieve.
     * @return mixed Value stored under the given configuration key.
     * @throws UnknownConfigurationKey If an unknown key was provided.
     */
    public function get($key)
    {
        if (! array_key_exists($key, $this->allowedKeys)) {
            throw UnknownConfigurationKey::fromTransformerKey(self::class, $key);
        }

        // At this point, the configuration should either have received this value or filled it with a default.
        return $this->$key;
    }

    /**
     * Get the associative array of allowed keys and their respective default values.
     *
     * The array index is the key and the array value is the key's default value.
     *
     * @return array Associative array of allowed keys and their respective default values.
     */
    abstract protected function getAllowedKeys();

    /**
     * Validate an individual configuration entry.
     *
     * @param string $key   Key of the configuration entry to validate.
     * @param mixed  $value Value of the configuration entry to validate.
     * @return mixed Validated value.
     */
    abstract protected function validate($key, $value);
}
