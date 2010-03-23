#!/usr/bin/ruby

require 'rubygems'

require 'optparse' 
require 'ostruct'
require 'parseconfig'
require 'fileutils'

require "modules/GenericApplication"
require "modules/Compressor"
require "modules/IOHelper"
require "classes/Builder"

#-------------------------------------------------
#   instantiate new builder object and build
#-------------------------------------------------

builder = Builder.new(ARGV, STDIN)

builder.build
