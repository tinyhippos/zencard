#!/usr/bin/ruby

require 'rubygems'

require 'optparse' 
require 'ostruct'
require 'parseconfig'
require 'fileutils'

require "modules/Compressor"
require "modules/Helpers"
require "classes/Builder"

#-------------------------------------------------
#   instantiate new builder object and build
#-------------------------------------------------

builder = Builder.new(ARGV, STDIN)

builder.build
