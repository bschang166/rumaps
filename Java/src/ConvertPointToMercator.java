import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;

public class ConvertPointToMercator {
    public static void main(String[] args) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setValidating(true);
        factory.setIgnoringElementContentWhitespace(true);
        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            File file = new File("Java/Livingston Campus Center.svg");
            Document doc = builder.parse(file);
            NodeList polygons = doc.getElementsByTagName("polygon");
            Node polygon = polygons.item(0);
            NamedNodeMap attributes = polygon.getAttributes();
            Node pointsNode = attributes.item(0);
            System.out.println(printPoints(removeExtraSpaces(pointsNode.getNodeValue())));
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String printPoints(String points) {
        StringBuilder sb = new StringBuilder();
        String[] pointsArray = points.split(" ");
        for (int i = 0; i < pointsArray.length; i++) {
            String[] coordinates = pointsArray[i].split(",");
            sb.append("new google.maps.LatLng(");
            sb.append(Double.parseDouble(coordinates[0]));
            sb.append(",");
            sb.append(Double.parseDouble(coordinates[1]));
            sb.append(")");
            if (i != pointsArray.length - 1) {
                sb.append(",\n");
            }
        }
        return sb.toString();
    }

    //String Utilities
    public static String removeExtraSpaces(String str) {
        return str.replaceAll("\\s+", " ");
    }

    //START Dom Utilities
    public static String printDocument(Document document, String tag) {
        StringBuilder sb = new StringBuilder();
        printNodeList(document.getElementsByTagName(tag), sb, 0);
        return sb.toString();
    }

    public static void printNodeList(NodeList nodeList, StringBuilder sb, int depth) {
        if (nodeList == null) {
            return;
        }
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            printNode(node, sb, i);
            printNodeList(node.getChildNodes(), sb, ++depth);
            depth--;
        }
    }

    public static void printNode(Node node, StringBuilder sb, int depth) {
        indent(sb, depth);
        sb.append("NodeName() = ").append(node.getNodeName());
        sb.append("\n");

        indent(sb, depth);
        sb.append("NodeValue() = ").append(node.getNodeValue());
        sb.append("\n");

        printAttributes(node.getAttributes(), sb, depth);
    }

    public static void printAttributes(NamedNodeMap namedNodeMap, StringBuilder sb, int depth) {
        if (namedNodeMap == null) {
            return;
        }
        for (int i = 0; i < namedNodeMap.getLength(); i++) {
            indent(sb, ++depth);
            sb.append("Attributes\n");
            printNode(namedNodeMap.item(i), sb, depth);
            depth--;
        }
    }

    public static void indent(StringBuilder sb, int num) {
        for (int i = 0; i < num; i++) {
            sb.append("\t");
        }
    }
    //END Dom Utilities
}
