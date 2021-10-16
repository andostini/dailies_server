

export function sort_and_filter(lib, key, direction) {
    lib.sort(function(a,b) {
        let val_a = a[key];
        let val_b = b[key];
        val_a.toUpperCase();
        val_b.toUpperCase();
    
        var comparison = 0;
        if (val_a > val_b) {
          comparison = 1;
        }
        else if (val_b > val_a){
          comparison = -1;
        }
        //Alway sort for scene, shot and take it comp = 0;
        if (comparison == 0 && key != 'scene') {
            //Comparing Scenes
            val_a = a['scene']
            val_b = b['scene']
            val_a.toUpperCase();
            val_b.toUpperCase();
    
            if (val_a > val_b) {
              comparison = 1;
            }
            else if (val_b > val_a){
              comparison = -1;
            }
        }
    
        if (comparison == 0) {
          //Comparing Shots
          val_a = a['shot']
          val_b = b['shot']
          val_a.toUpperCase();
          val_b.toUpperCase();
    
          if (val_a > val_b) {
            comparison = 1;
          }
          else if (val_b > val_a){
            comparison = -1;
          }
        }
    
          //Comparing Takes
        if (comparison == 0) {
          val_a = a['take']
          val_b = b['take']
          val_a.toUpperCase();
          val_b.toUpperCase();
    
          if (val_a > val_b) {
            comparison = 1;
          }
          else if (val_b > val_a){
            comparison = -1;
          }
        }
    
    
        return comparison;
      });
      return lib;
}