<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

ini_set("memory_limit", "512M");

class Kernel extends BaseKernel
{
    use MicroKernelTrait;
}
