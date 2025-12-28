import { HexagonalTableau, Kase2D } from '../../service/tableau.ts';

export class HexagonalTableauBis<TypeKase  extends Kase2D>  extends HexagonalTableau<TypeKase>{
    // You can add custom methods or override existing ones here
    neighbors(kase: TypeKase): TypeKase[] {
        const directions = [
            {dx: -1, dy: 0},
          //  {dx: -1, dy: 1},
            {dx: 0, dy: 1},
            //{dx: 0, dy: -1},
            {dx: 1, dy: -1},
            //{dx: 1, dy: 0}
        ];
        const neighbors: TypeKase[] = [];
        for (const {dx, dy} of directions) {
            const neighbor = this.getKase(kase.x + dx, kase.y + dy);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }
}
