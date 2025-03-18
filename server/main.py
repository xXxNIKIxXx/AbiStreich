# coding=utf-8
from Website.__init__ import create_app

if __name__ == '__main__':    
    try:
        app = create_app()
        
        app.run(host='0.0.0.0', port=5001, debug=True)
    except Exception as e:
        import traceback
        traceback.print_exc()
