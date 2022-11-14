export const getName = () => {
    const first = ['Ivan', 'Pero', 'Marko', 'Ana', 'Ivana', 'Jelena', 'Mario', 'Stjepan', 'Mirko', 'Hrvoje', 'Tomislav', 'Valentina'];
    const second = ['Ivić', 'Perić', 'Markić', 'Anić', 'Jelenić', 'Horvat', 'Radić'];

    const firstIndex = Math.floor(Math.random() * (first.length-1));
    const secondIndex = Math.floor(Math.random() * (second.length-1))

    return first[firstIndex] + " " + second[secondIndex];
}

export const getColor = () => {
    const colors = ['red', 'darkgreen', 'blue', 'brown', 'orange', 'gray'];
    const index = Math.floor(Math.random() * (colors.length-1));

    return colors[index];
}