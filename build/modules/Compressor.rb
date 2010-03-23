# Compressor
#
# Used for posting Strings to Google Closure Compiler
#
# API Reference
# http://code.google.com/closure/compiler/docs/api-ref.html

module Compressor

    require 'net/http'
    require 'uri'

    # Compress packed jscode (String)
    #
    # Arguments
    #   * compilation_level :: closure compiler compilation level identified (String) (ex "SIMPLE_OPTIMIZATIONS")
    #   * jscode :: (String) to optimize
    def compress(output_info, compilation_level, jscode)

        response = Net::HTTP.post_form(URI.parse('http://closure-compiler.appspot.com/compile'), {
                                        'js_code' => jscode,
                                        'compilation_level' => compilation_level,
                                        'output_format' => 'text',
                                        'warning_level' => 'default',
                                        'output_info' => output_info
                                        })
        response.body

    end
  
end